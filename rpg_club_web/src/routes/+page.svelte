<script lang="ts">
    // import "bulma/css/bulma.css";
    import { onMount } from "svelte";
    import { update } from "../core";
    import view from "../core";
    import { EventVariantGet, Game } from "shared_types/types/shared_types";

    let games = $state<Game[]>([]);

    view.subscribe((view) => {
        games = view.games;
    });

    onMount(async () => {
        console.log("mount");

        update(new EventVariantGet());
    });
</script>

<h1>RPG Club app</h1>
<p>Games:</p>

<section class="box container has-text-centered m-5">
    {#each games as game}
        <p>{game.id}: {game.name}</p>
    {/each}
</section>
