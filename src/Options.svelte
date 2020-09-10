<script lang="ts">
  import { Goal, myGoals, myTopics, OptionsMode, Topic, colors } from "./store";

  let option = 1;

  // Create Goal case
  let goal = new Goal(null, "", "", "");

  const createTopic = new Topic("0", "-- Create Topic --", "white");

  $: if (goal.topic == createTopic) {
    option = 2;
    goal.topic = null;
  }

  // New Topic case
  let newTopic = new Topic("0", "", "");

  // Delete Topic case
  let deleteTopic = new Topic("", "", "");
  $: console.log(deleteTopic);

  // Edit Topic
  let editTopic = new Topic("", "", "");

  $: console.log($myTopics);
</script>

<style>
  .options {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
  }
  .optionEditor {
    margin: 16px 24px;
    display: flex;
    justify-content: center;
  }
  .optionEditor > div {
    display: flex;
    flex-direction: column;
    width: 260px;
  }

  input,
  textarea,
  select,
  button {
    display: flex;
    align-items: center;
    font-weight: 200;
    font-size: 20px;
    margin-bottom: 8px;
    border: grey 1px solid;
  }
  label {
    display: flex;
    font-weight: 200;
    font-size: 20px;
    padding: 8px 12px;
    border: black solid 1px;
    border-right: none;
    border-top: none;
    width: 80px;
    text-align: center;
    box-sizing: border-box;
    background: white;
  }
  button {
    display: block;
    text-align: center;
    width: 100%;
  }
  input,
  textarea,
  select {
    border-radius: 0px;
    width: 100%;
  }
  input[type="radio"] {
    display: none;
  }
  .selectedTab {
    background: #f3efee;
    border-bottom: #f3efee solid 1px;
  }
  .selectedTabLeft {
    background: #f3efee;
    border-bottom: #f3efee solid 1px;
    border-right: none;
    border-left: none;
  }
  .selectedTabRight {
    background: #f3efee;
    border-bottom: #f3efee solid 1px;
  }
</style>

{#if $OptionsMode}
  <div style="border: 1px solid black; margin: 16px 36px; background:#f3efee">
    <div class="options">
      <label class:selectedTabLeft={option == 1} style="border-left:none;">
        <input type="radio" bind:group={option} value={1} />
        Create Goal
      </label>
      <label class:selectedTab={option == 2}>
        <input type="radio" bind:group={option} value={2} />
        New Topic
      </label>
      <label class:selectedTab={option == 3}>
        <input type="radio" bind:group={option} value={3} />
        Delete Topic
      </label>
      <label class:selectedTabRight={option == 4}>
        <input type="radio" bind:group={option} value={4} />
        Edit Topic
      </label>
    </div>
    <div class="optionEditor">
      {#if option == 1}
        <div>
          <select
            bind:value={goal.topic}
            style="background:{goal.topic == null ? 'white' : goal.topic.color}">
            <option disabled selected value={null}>-- Select a Topic --</option>
            {#each $myTopics as topic}
              <option value={topic} style="background:{topic.color};">
                {topic.text}
              </option>
            {/each}
            <option style="background:white;" value={createTopic}>
              -- Create Topic --
            </option>
          </select>
          <input placeholder="Enter Goal..." bind:value={goal.text} />
          <textarea placeholder="Enter Notes..." bind:value={goal.notes} />
          <input type="datetime-local" bind:value={goal.dueDate} />
          <button
            on:click={() => {
              if (goal.topic == null) {
                alert('Topic is not selected!');
              } else if (goal.text == '') {
                alert('No Goal is specified');
              } else if (goal.dueDate == '') {
                alert('No Date is selected!');
              } else {
                myGoals.addGoal(goal, true);
                goal = new Goal(null, '', '', '');
              }
            }}>
            Submit
          </button>
          <button on:click={() => (goal = new Goal(null, '', '', ''))}>
            Cancel
          </button>
        </div>
      {:else if option == 2}
        <div>
          <input bind:value={newTopic.text} placeholder="Enter Topic text..." />
          <select
            bind:value={newTopic.color}
            style="background:{newTopic.color == '' ? 'white' : newTopic.color}">
            <option disabled selected value="">-- Select a Color --</option>
            {#each colors as { code, name }}
              <option value={code} style="background:{code}">{name}</option>
            {/each}
          </select>
          <button
            on:click={() => {
              if (newTopic.text == '') {
                alert('No text in the Topic!');
              } else if (newTopic.color == '') {
                alert('No color selected for Topic!');
              } else {
                myTopics.addTopic(newTopic, true);
                newTopic = new Topic('', '', '');
              }
            }}>
            Submit
          </button>
          <button on:click={() => (newTopic = new Topic('0', '', ''))}>
            Cancel
          </button>
        </div>
      {:else if option == 3}
        <div>
          <select bind:value={deleteTopic.id} style="background:white;">
            <option disabled selected value="">-- Select a Topic --</option>
            {#each $myTopics as topic}
              <option value={topic.id} style="background:{topic.color};">
                {topic.text}
              </option>
            {/each}
          </select>
          <button
            on:click={() => {
              if (deleteTopic.id != '') {
                if (confirm(`Are you sure you want to delete topic? ${newTopic.text}` + 'It will delete all uncompleted tasks with that topic.' + 'It is possible to edit the topic for all tasks.')) {
                  myGoals.deleteGoalsByTopic(deleteTopic.id);
                  myTopics.deleteTopic(deleteTopic.id);
                  deleteTopic = new Topic('', '', '');
                  alert('deleted!');
                }
              } else {
                alert('Select a topic to delete!');
              }
            }}>
            Delete
          </button>
        </div>
      {:else if option == 4}
        <div>
          <select
            bind:value={editTopic}
            style="background:{editTopic.id == '' ? 'white' : editTopic.color};">
            <option
              disabled
              selected
              value={new Topic('', '', '')}
              style="background:white;">
              -- Select a Topic --
            </option>
            {#each $myTopics as topic}
              <option value={topic} style="background:{topic.color};">
                {topic.text}
              </option>
            {/each}
          </select>
          {#if editTopic.id != ''}
            <input
              bind:value={editTopic.text}
              on:input={(a) => {
                myGoals.set([...$myGoals]);
                myTopics.updateTopic(editTopic);
              }} />
            <select
              bind:value={editTopic.color}
              on:input={() => {
                myGoals.set([...$myGoals]);
                myTopics.updateTopic(editTopic);
              }}
              style="background:{editTopic.color}">
              <option disabled selected value="">-- Select a Color --</option>
              {#each colors as { code, name }}
                <option value={code} style="background:{code}">{name}</option>
              {/each}
            </select>
          {/if}
        </div>
      {/if}
    </div>
  </div>
{/if}
