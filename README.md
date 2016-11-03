# vue-easy-tags

Makes it easy to generate HTML with Vue templates or render functions. Best
with `CoffeeTags` (https://github.com/shreeve/coffeescript/tree/coffee-tags).

## Example

In the following, `template` and `render` are equivalent.

```coffee
module.exports =

  methods:
    shout: (what) ->
      alert "You love #{what}?!"

  template: <*>
    <div@auth>
      <div class="flippable">
        <div>
          <img src="images/logo.svg">
          <h5 @click="shout('mozzarella')">Signin (Template)</h5>
          <form>
            <input name="email"    placeholder="Email">
            <input name="password" placeholder="Password" type="password">
            <button class="full" type="submit">Sign in to the Wellness Center</button>
          </form>
        </div>
      </div>
    </div>
  <*>

  render: (h) ->
    <@auth>
      <.flippable>
        <>
          <img> src: "images/logo.svg"
          <h5> (on: click: => @shout 'cheddar'), "Signin (Render)"
          <form>
            <input> name: "email"   , placeholder: "Email"
            <input> name: "password", placeholder: "Password", type: "password"
            <button.full> (type: "submit"), "Sign in to the Wellness Center"
```

## License

MIT
