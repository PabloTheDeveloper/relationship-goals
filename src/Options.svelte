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
    padding: 0px 20px;
    box-sizing: border-box;
    align-items: center;
  }
  .optionEditor {
    margin: 16px 24px;
    display: flex;
  }
  .optionEditor > div {
    display: flex;
    flex-direction: column;
    width: 40%;
  }
  .optionEditor > div > div {
    display: flex;
    flex-direction: row;
  }
  span {
    font-weight: 200;
    font-size: 20px;
    color: lightslategray;
  }
  label,
  input,
  label,
  textarea,
  select,
  button {
    display: flex;
    align-items: center;
    border-radius: 30px;
    padding: 4px 16px;
    margin: 4px 4px;
    font-weight: 200;
    border: grey 1px solid;
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
</style>

<!-- svelte-ignore empty-block -->
{#if $OptionsMode}
  <div class="options">
    <label style="background:{option == 1 ? '#ddd' : 'white'}">
      <input type="radio" bind:group={option} value={1} />
      Create Goal
    </label>
    <span>|</span>
    <label style="background:{option == 2 ? '#ddd' : 'white'}">
      <input type="radio" bind:group={option} value={2} />
      New Topic
    </label>
    <label style="background:{option == 3 ? '#ddd' : 'white'}">
      <input type="radio" bind:group={option} value={3} />
      Delete Topic
    </label>
    <label style="background:{option == 4 ? '#ddd' : 'white'}">
      <input type="radio" bind:group={option} value={4} />
      Edit Topic
    </label>
  </div>
  <div class="optionEditor">
    {#if option == 1}
      <div>
        <h2>Create Goal</h2>
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
        <h2>Create New Topic</h2>
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
        <h2>Delete Topic</h2>
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
        <h2>Edit Topic</h2>
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
    {:else}{/if}
  </div>
{/if}
