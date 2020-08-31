import { writable } from "svelte/store"
import { db } from "./firebase";

export const colors = [
  { name: "Blanched Almond", code: "#ffebcd" },
  { name: "Peach Puff", code: "#ffdab9" },
  { name: "Azure", code: "#f0ffff" },
  { name: "Lavander", code: "#e6e6fa" },
  { name: "Misty Rose", code: "#ffe5e1" },
  { name: "Light Sky Blue", code: "#87cefa" },
  { name: "Dark sea Green", code: "#8fbc8f" },
  { name: "Khaki", code: "#f0e68c" },
  { name: "Light Coral", code: "#f08080" },
  { name: "Dark Orange", code: "#ff8c00" },
  { name: "Plum", code: "#dda0dd" },
]

export class Topic {
  id: string;
  text: string;
  color: string;

  constructor(id, text, color) {
    this.id = id
    this.text = text
    this.color = color
  }
}

export class Goal {
  id: string
  topic: Topic
  text: string
  notes: string
  dueDate: string

  constructor(topic, text, notes, dueDate) {
    this.topic = topic
    this.text = text
    this.notes = notes
    this.dueDate = dueDate
  }
}

const extractDateInfo = (datetimeLocal: string) => {
  let [year, month, dayTime] = datetimeLocal.split("-")
  let [day, time] = dayTime.split("T")
  let [hour, minute] = time.split(":")
  return [parseInt(year), parseInt(month), parseInt(day), parseInt(hour), parseInt(minute)]
}

export const createTopics = () => {
  const { set, subscribe, update } = writable([])
  return {
    addTopic: (topic: Topic, isDBBacked: boolean) => {
      if (isDBBacked) {
        db.collection("topics").add({
          text: topic.text,
          color: topic.color,
        }).then((docRef) => {
          topic.id = docRef.id
          update(items => [...items, topic])
        })
      } else {
        update(items => [...items, topic])
      }
    },
    updateTopic: (topic: Topic) => {
      update(items => {
        const idx = items.findIndex((t) => {
          if (topic.id == t.id) {
            return true
          }
          return false
        });
        db.collection("topics").doc(topic.id).update({
          text: topic.text,
          color: topic.color,
        }).then(() => console.log("Edited topic"))
        return [...items.slice(0, idx), topic, ...items.slice(idx + 1)]
      })
    },
    deleteTopic: (topicID: string) => {
      update(items => {
        const idx = items.findIndex((t) => {
          if (topicID == t.id) {
            return true
          }
          return false
        });
        db.collection("topics").doc(items[idx].id).delete()
        return [...items.slice(0, idx), ...items.slice(idx + 1)]

      });

    },
    subscribe,
    set,
  }
}

export const createGoals = () => {
  const { set, subscribe, update } = writable([])
  return {
    sortGoals: () => {
      update(items => {
        return [...items.sort((goalA, goalB) => {
          let dateInfoA = extractDateInfo(goalA.dueDate)
          let dateInfoB = extractDateInfo(goalB.dueDate)
          console.log(dateInfoA, dateInfoB)
          let i = 0
          while (i < 5) {
            if (dateInfoA[i] != dateInfoB[i]) {
              return dateInfoA[i] - dateInfoB[i]
            }
            i++
          }
          return 0
        })]
      })
    },
    addGoal: (goal: Goal, isDBBacked: boolean) => {
      if (isDBBacked) {
        db.collection("goals").add({
          topic: goal.topic.id,
          text: goal.text,
          notes: goal.notes,
          dueDate: goal.dueDate,
        }).then((docRef) => {
          goal.id = docRef.id
          update(items => {
            items = [...items, goal]
            return [...items.sort((goalA, goalB) => {
              let dateInfoA = extractDateInfo(goalA.dueDate)
              let dateInfoB = extractDateInfo(goalB.dueDate)
              console.log(dateInfoA, dateInfoB)
              let i = 0
              while (i < 5) {
                if (dateInfoA[i] != dateInfoB[i]) {
                  return dateInfoA[i] - dateInfoB[i]
                }
                i++
              }
              return 0
            })]
          })
        })
      } else {
        update(items => {
          items = [...items, goal]
          return [...items.sort((goalA, goalB) => {
            let dateInfoA = extractDateInfo(goalA.dueDate)
            let dateInfoB = extractDateInfo(goalB.dueDate)
            console.log(dateInfoA, dateInfoB)
            let i = 0
            while (i < 5) {
              if (dateInfoA[i] != dateInfoB[i]) {
                return dateInfoA[i] - dateInfoB[i]
              }
              i++
            }
            return 0
          })]
        })
      }
    },
    deleteGoal: (idx: number) => {
      update(items => {
        db.collection("goals").doc(items[idx].id).delete()
        return [...items.slice(0, idx), ...items.slice(idx + 1)]
      });
    },
    deleteGoalsByTopic: (topicID: string) => {
      update(items => {
        return [...items.filter(goal => {
          if (topicID == goal.topic.id) {
            db.collection("goals").doc(goal.id).delete()
            return false
          }
          return true
        })];
      })
    },
    subscribe,
    set,
  }
}

export const myGoals = createGoals()
export const myTopics = createTopics()

db.collection("topics").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const id = doc.id
    const data = doc.data()
    const topic = new Topic(id, data.text, data.color)
    myTopics.addTopic(topic, false)

    db.collection("goals").where("topic", "==", doc.id).get().
      then((querySelector) => {
        querySelector.forEach((doc) => {
          const id = doc.id
          const data = doc.data()
          const goal = new Goal(topic, data.text, data.notes, data.dueDate)
          goal.id = id
          myGoals.addGoal(goal, false)
        })
      })
  })
})

export const showCompletedDeleteMode = writable(true)
export const OptionsMode = writable(true)