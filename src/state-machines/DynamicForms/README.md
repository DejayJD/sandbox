#  XState Experiments

**Experiment:** Use XState in a more dynamic use case where the machine is generated inside of a component lifecycle. 

**Goals:** 

* Try to mock up a scenario where a state machine that it would be generated based on some sort of API response. 
  * A common use case at my current job, Bestow, is that our form submit buttons should direct you to the first error/value you're missing (and clicking them scrolls and focuses on the borked input)
* Figure out if the dev tools continue to work with a non-static machine
* Figure out how to put the non-static machine into the visualizer
* See if error handling (invalid states and whatnot) still works with a non-static machine

**Findings:**

**tl;dr** - Dynamic machines are easy, but this specific example of progressive form state focus was not very good because deciding which events to send is too messy without basically reproducing the logic to check which error should be focused (stepping into the state machine territory).

*The Good*

* Generally no issues with making a dynamic machine on component mount 😎
* Dev tools still work great
* It's not that hard to paste the machine into xstate.com/viz because you can just `JSON.stringify` the machine object and its easy to wrap that in a `Machine()` and paste that into the visualizer

*The Ugly*

* Figuring out when to emit events was extremely challenging for this with the current RHF setup. Given that you can't just attach your own `onBlur` by default, I thought I would attempt to hook into errors and touched fields 

*The Bad*

* This implementation is not something I would swear by just because it would not scale well with lots of questions until I can do an `onBlur` implementation

**Unresolved Questions**

I wonder if there's a way to check if an event *would* cause a state machine change without having to send it. It would be interesting to filter out events and not send things if it wouldn't change something, or just halt loops when an event pops up that could. This maybe could solve the issue of sending an event for every single form valid

