<script lang="ts">
  import { db } from "./firebase";

  import { myGoals, Goal, showCompletedDeleteMode, Topic } from "./store";

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

  $: console.log($myGoals);
</script>

<style>
  .goalsTableContainer {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  table {
    padding: 24px;
    max-width: 1300px;
  }
  th > div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
  }

  th > div > i {
    position: relative;
    height: 100%;
    padding: 0px 8px;
  }

  input,
  textarea {
    height: 100%;
    width: 100%;
    font-size: 16px;
    font-weight: 200;
    resize: none;
    border: none;
    border-bottom: 1px solid darkgray;
  }

  textarea {
    display: block;
    white-space: nowrap;
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
  .dueDate {
    width: 220px;
  }
</style>

<div class="goalsTableContainer">
  <table width="100%" cellpadding="0" cellspacing="0">
    <th>
      <h2>Topic</h2>
    </th>
    <th>
      <h2>Goal</h2>
    </th>
    <th>
      <h2>Note(s)</h2>
    </th>
    <th>
      <div>
        <h2>Due Date</h2>
        <i class="fas fa-sort-down" on:click={() => myGoals.sortGoals()} />
      </div>
    </th>
    {#each $myGoals as { id, topic, text, notes, dueDate }, idx}
      <tr>
        <td width="100px">
          <div style="background:{topic.color};">{topic.text}</div>
        </td>
        <td width="140px">
          <input
            style="text-align: center;background:{topic.color};"
            bind:value={text}
            on:input={updateInput(id, 'text')} />
        </td>
        <td>
          <textarea
            style="background:{topic.color};"
            bind:value={notes}
            on:input={updateInput(id, 'notes')} />
        </td>
        <td width="220px">
          <input
            class="dueDate"
            style="text-align: right;background:{topic.color};"
            type="datetime-local"
            bind:value={dueDate}
            on:input={updateInput(id, 'dueDate')} />
        </td>
        {#if $showCompletedDeleteMode}
          <td width="90px">
            <i
              class="fas fa-trash"
              on:click={() => {
                if (confirm(`Do you want to delete goal ${text}`)) {
                  myGoals.deleteGoal(idx);
                }
              }} />
          </td>
        {/if}
      </tr>
    {/each}
  </table>
</div>
