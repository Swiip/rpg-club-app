<script lang="ts">
    // import "bulma/css/bulma.css";
    import { onMount } from "svelte";
    import { update } from "../core";
    import view from "../core";
    import { EventVariantReset, EventVariantIncrement, EventVariantDecrement } from "shared_types";

    let count = $state("");

    view.subscribe((view) => (count = view.count));

    onMount(async () => {
        console.log("mount");
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<section class="box container has-text-centered m-5">
    <p class="is-size-5">{count}</p>
    <div class="buttons section is-centered">
        <button class="button is-primary is-danger" on:click={() => update(new EventVariantReset())}>
            {"Reset"}
        </button>
        <button class="button is-primary is-success" on:click={() => update(new EventVariantIncrement())}>
            {"Increment"}
        </button>
        <button class="button is-primary is-warning" on:click={() => update(new EventVariantDecrement())}>
            {"Decrement"}
        </button>
    </div>
</section>
