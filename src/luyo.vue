<template>
    <hello-world />
    <router-view />
</template>

<script>
  // gotta explicitly grab the tools you want to use from Vue
  import { onMounted, watch, computed, ref } from "vue";
  import HelloWorld from './components/HelloWorld.vue';
  //import { mapState } from "vuex";

  /* 
    you can actually move this entire block into a standalone js file and import it just like above.
    doing so means it can be reused in various locations
    you'll simpley need to return it in your local setup function
    to import multiple items, you'll need to destructure just like line 7 above, placing the imported
      code into a local space and returning those explicit items rather than the entire block
      this is best practice for v3
  */
	export default ({
    // props: { just the usual structure, nice! },
    /* 
      setup runs before creation, after props are resolved.
      you can use the setup function to replace beforeCreated and Created hooks
    */
    components: {
      HelloWorld,
    },
    setup() { // setup(props, context) {

      // use ref for integers, strings, and even arrays, but not for objects
      const example = ref(''); // though you have to use '.value' in the js bits, you can just use the name in your template
      const captainName = computed(() => {
        let tempy = 'temp';
        return tempy;
      });

      /* 
      OR, you can bundle em up in a nice package and say 'fuck ref' functions.
      you'll need to import the 'reactive' function from vue
      this is a fine, entirely optional syntax

      const myStuff = reactive({
          example: '',
          captainName: computed(() => {
            let tempy = 'temp';
            return tempy;
          }),
      });
      */

      //watchEvents -- a new function similar to 'watch' but will fire for literally every event update of any kind whatsoever...

      watch(captainName, (newValue, oldValue) => { // new and old object bit is optionl but kinda neat
        // do shit when name changes
        console.log(`Captain ${oldValue} is now known as ${newValue}`);
      }, { immediate: false }); // the immediate flag is optional and false by default, I'm just taking notes

      onMounted(() => { // add 'on' in front of the usual lifecycle hooks to use them in the setup function
        console.log("app is mounted");
      });

      const myFunction = (something) => {
        example.value = something;
      }
    
      return {
        // ...toRefs(myStuff), // basically destructures the object. need to import function from vue
        example,
        captainName,
        myFunction,
      }
    },
    /*
    // this old syntax is still okay! but you either role setup() or you don't...
    computed: {
      ...mapState({
        captainName: (state) => state.session.captainName,
      }),
    },
    mounted() {
      // do things on mount
    },
    */
  });
</script>

<style>

</style>
