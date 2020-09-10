<script lang="ts">
  import { db } from "../firebase";
  import { Goal, myGoals, showCompletedDeleteMode } from "../store";
  export let goal: Goal;
  export let idx: number;

  function updateInput(id, attribute: string) {
    return function (event: any) {
      const inputVal = event.target.value;
      if (attribute == "dueDate") {
        db.collection("goals")
          .doc(id)
          .update({
            dueDate: inputVal.slice(0, 16),
          });
      }
      db.collection("goals")
        .doc(id)
        .update({
          [attribute]: inputVal,
        });
    };
  }
</script>

<style>
  input,
  textarea {
    height: 100%;
    width: 100%;
    font-size: 14px;
    font-weight: 200;
    resize: none;
    border: none;
    border-bottom: 1px solid darkgray;
  }

  textarea {
    display: block;
    white-space: nowrap;
  }

  .dueDate {
    width: 220px;
  }
  td > div {
    height: 100%;
    font-weight: 200;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid darkgray;
  }
</style>

<tr>
  <td width="100px">
    <div style="background:{goal.topic.color};">{goal.topic.text}</div>
  </td>
  <td width="140px">
    <input
      style="text-align: center;background:{goal.topic.color};"
      bind:value={goal.text}
      on:input={updateInput(goal.id, 'text')} />
  </td>
  <td>
    <textarea
      style="background:{goal.topic.color};"
      bind:value={goal.notes}
      on:input={updateInput(goal.id, 'notes')} />
  </td>
  <td width="220px">
    <input
      class="dueDate"
      style="text-align: right;background:{goal.topic.color};"
      type="datetime-local"
      bind:value={goal.dueDate}
      on:input={updateInput(goal.id, 'dueDate')} />
  </td>
  {#if $showCompletedDeleteMode}
    <td width="85px">
      <i
        class={goal.isDone ? 'fas fa-times-circle' : 'fas fa-check-circle'}
        on:click={() => {
          db.collection('goals').doc(goal.id).update({ isDone: !goal.isDone });
          goal.isDone = !goal.isDone;
          $myGoals = [...$myGoals];
        }} />
      <i
        class="fas fa-trash"
        on:click={() => {
          if (confirm(`Do you want to delete goal ${goal.text}`)) {
            myGoals.deleteGoal(idx);
          }
        }} />
    </td>
  {/if}
</tr>
