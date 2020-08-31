<script lang="ts">
  import { Goal, myGoals, OptionsMode, showCompletedDeleteMode } from "./store";
  import Switch from "./components/Switch.svelte";
</script>

<header>
  <h1>Relationship Goals</h1>
  <Switch label="Options Mode" bind:checked={$OptionsMode} />
  <Switch label="Done/Delete Mode" bind:checked={$showCompletedDeleteMode} />
</header>
