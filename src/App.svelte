<script lang="ts">
  import { myGoals, Goal, showCompletedDeleteMode, Topic } from "./store";

  import Header from "./Header.svelte";
  import Options from "./Options.svelte";
  import GoalsTable from "./GoalsTable.svelte";
  let selected: number = -1;

  function updateInput(idx: number, attribute: string) {
    return function (event: any) {
      if (attribute == "dueDate") {
        console.log(event.target.value.slice(0, 16));
      }
      console.log(event.target.value);
    };
  }
</script>

<main>
  <Header />
  <div style="display:flex; justify-content: center; width: 100%; flex-wrap:wrap;">
  <Options />
  <GoalsTable />
  </div>
</main>
