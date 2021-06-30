<template>
	<div id="luyo-app" data-page="launch">
		<main id="content" class="launch">
            <h2>Welcome, Captain</h2>
            <form class="login-form">
                <label for="captain" class="label" required>Call Sign</label>
                <input name="captain" class="field" tabindex="1" required />
                <button
                    name="login-submit"
                    class="form-action form-action_primary"
                    @click="begin"
                    type="button"
                    tabindex="2"
                >Access Command Module</button>
            </form>
		</main>
	</div>
</template>

<script>
    export default {
        name: "launch",
        methods: {
           begin() {
               console.log('doing it!');
           }
        }
    };
</script>

<style>

</style>
