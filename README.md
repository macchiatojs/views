# @macchiatojs/views

### View engine based on ejs help to render content for Macchiato.js

## `Installation`

```bash
# npm
$ npm install @macchiatojs/views
# yarn
$ yarn add @macchiatojs/views
```

## `Usage`

First, you should create a directory in which you have all views templates.
You can do it by run this command and make sure your in the source code folder;

```bash
mkdir views
```

Second, you should create a template file.
You can do it by run this command;

```bash
touch views/home.html
```

Third, you should put your ejs logic inside the file. something like;

```html
<ul>
  <% users.forEach((user) => {%>
  <li><%= user.name %></li>
  <% })%>
</ul>
```

Finally, you can use `@macchiatojs/views`;

```typescript
import ViewEngine from "@macchiatojs/views";

const viewEngine = new ViewEngine({
  root: path.join(__dirname, "views"),
  viewExt: "html",
});

const htmlString = await viewEngine.generateHtml("home", { users });
// htmlString have a string with this values
// <ul>
//   <li>Jawher</li>
//   <li>Imed</li>
//   <li>Tom</li>
// </ul>
```

#### License

---

[MIT](LICENSE) &copy; [Imed Jaberi](https://github.com/3imed-jaberi)
