<script lang="ts">
  import { myGoals, Goal, showCompletedDeleteMode, Topic } from "./store";
  import GoalRow from "./components/GoalRow.svelte";
  let group = 1;
</script>

<style>
  .tabs {
    display: flex;
    align-items: flex-end;
  }
  label {
    display: flex;
    font-weight: 200;
    font-size: 20px;
    padding: 8px 12px;
    border: black solid 1px;
    width: 80px;
    text-align: center;
    box-sizing: border-box;
  }
  input[type="radio"] {
    display: none;
  }
  i {
    text-align: center;
  }
  table {
    max-width: 1300px;
    background: #f3efee;
    border: 1px solid black;
    border-top: none;
    padding: 18px;
    box-sizing: border-box;
  }
  th {
    background: white;
  }
  th > div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 36px;
    background: white;
  }

  th > div > i {
    position: relative;
    height: 100%;
    padding: 0px 8px;
  }

  .selectedTabLeft {
    background: #f3efee;
    border-bottom: #f3efee 1px solid;
    border-right: none;
  }
  .selectedTabRight {
    background: #f3efee;
    border-bottom: #f3efee 1px solid;
    border-left: none;
  }
</style>

<div style="width: 60%; max-width: 1300px; margin: 8px 36px;">
  <div class="tabs">
    <label class:selectedTabLeft={group == 1}>
      <input type="radio" bind:group value={1} />
      Todo
    </label>
    <label class:selectedTabRight={group == 2}>
      <input type="radio" bind:group value={2} />
      Done
    </label>
    <hr />
  </div>
  <table width="100%" cellpadding="0" cellspacing="0">
    <th>
      <h3>Topic</h3>
    </th>
    <th>
      <h3>Goal</h3>
    </th>
    <th>
      <h3>Note(s)</h3>
    </th>
    <th>
      <div>
        <h3>Due Date</h3>
        <i class="fas fa-sort-down" on:click={() => myGoals.sortGoals()} />
      </div>
    </th>
    {#each $myGoals as goal, idx}
      {#if goal.isDone == false && group == 1}
        <GoalRow bind:goal {idx} />
      {:else if goal.isDone == true && group == 2}
        <GoalRow bind:goal {idx} />
      {/if}
    {/each}
  </table>
</div>
