<!-- markdownlint-disable single-title no-duplicate-heading -->

# UI Kit

<details>
  <summary>View the markdown source for this page</summary>
  <div style="max-height: 50vh; overflow: auto;">

[ui-kit.md](ui-kit.md ':include :type=code')

  </div>
</details>

## Blockquotes

> Cras aliquet nulla quis metus tincidunt, sed placerat enim cursus. Etiam
> turpis nisl, posuere eu condimentum ut, interdum a risus. Sed non luctus mi.
> Quisque malesuada risus sit amet tortor aliquet, a posuere ex iaculis. Vivamus
> ultrices enim dui, eleifend porttitor elit aliquet sed.
>
> _- Quote Source_

#### Nested

<!-- prettier-ignore -->
> Level 1
> > Level 2
> > > Level 3

## Buttons

#### Default

<button>Button</button>

#### Basic

<button type="button">Button</button>
<a href="javascript:void(0);" class="button">Link Button</a>
<input type="button" value="Input Button" class="button">

#### Primary

<button type="button" class="primary">Button</button>
<a href="javascript:void(0);" class="button primary">Link Button</a>
<input type="button" value="Input Button" class="primary">

#### Secondary

<button type="button" class="secondary">Button</button>
<a href="javascript:void(0);" class="button secondary">Link Button</a>
<input type="button" value="Input Button" class="secondary">

## Callouts

!> **Important** callout with `inline code` and additional placeholder text used
to force the content to wrap and span multiple lines.

?> **Tip** callout with `inline code` and additional placeholder text used to
force the content to wrap and span multiple lines.

## Code

This is `inline code`

```javascript
const add = (num1, num2) => num1 + num2;
const total = add(1, 2);

console.log(total); // 3
```

```html
<body>
  <p>Hello</p>
</body>
```

## Colors

#### Theme

<div class="ui-kit-color">
  <figure>
    <div style="background: var(--theme-color-1);"></div>
    <figcaption>1<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-2);"></div>
    <figcaption>2<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-3);"></div>
    <figcaption>3<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-4);"></div>
    <figcaption>4<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color);"></div>
    <figcaption>Theme Color<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-5);"></div>
    <figcaption>5<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-6);"></div>
    <figcaption>6<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-7);"></div>
    <figcaption>7<figcaption>
  </figure>
  <figure>
    <div style="background: var(--theme-color-8);"></div>
    <figcaption>8<figcaption>
  </figure>
</div>

#### Monochromatic

<div class="ui-kit-color">
  <figure>
    <div style="background: var(--color-mono-min); border: 1px solid var(--color-mono-2);"></div>
    <figcaption>Min<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-1);"></div>
    <figcaption>1<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-2);"></div>
    <figcaption>2<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-3);"></div>
    <figcaption>3<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-4);"></div>
    <figcaption>4<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-5);"></div>
    <figcaption>5<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-6);"></div>
    <figcaption>6<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-7);"></div>
    <figcaption>7<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-8);"></div>
    <figcaption>8<figcaption>
  </figure>
  <figure>
    <div style="background: var(--color-mono-max);"></div>
    <figcaption>Max<figcaption>
  </figure>
</div>

## Details

<details>
  <summary>Details (click to open)</summary>

Suscipit nemo aut ex suscipit voluptatem laboriosam odio velit. Ipsum eveniet labore sequi non optio vel. Ut culpa ad accusantium est aut harum ipsam voluptatum. Velit eum incidunt non sint. Et molestiae veniam natus autem vel assumenda ut numquam esse. Non nisi id qui vero corrupti quos et.

</details>

<details open>
  <summary>Details (open by default)</summary>

Suscipit nemo aut ex suscipit voluptatem laboriosam odio velit. Ipsum eveniet labore sequi non optio vel. Ut culpa ad accusantium est aut harum ipsam voluptatum. Velit eum incidunt non sint. Et molestiae veniam natus autem vel assumenda ut numquam esse. Non nisi id qui vero corrupti quos et.

</details>

## Form Elements

### Fieldset

<form>
  <fieldset>
    <legend>Legend</legend>
    <p>
      <label>
        Label<br>
        <input type="text" placeholder="Placeholder">
      </label>
    </p>
  </fieldset>
</form>

### Input

#### Checkbox

<form>
  <label><input type="checkbox" value="HTML"> HTML</label><br>
  <label><input type="checkbox" value="CSS"> CSS</label><br>
  <label><input type="checkbox" value="JavaScript"> JavaScript</label>
</form>

#### Datalist

<form>
  <label>
    Label<br>
    <input list="planets">
    <datalist id="planets">
      <option value="Earth">Earth</option>
      <option value="Jupiter">Jupiter</option>
      <option value="Mars">Mars</option>
      <option value="Mercury">Mercury</option>
      <option value="Neptune">Neptune</option>
      <option value="Saturn">Saturn</option>
      <option value="Uranus">Uranus</option>
      <option value="Venus">Venus</option>
    </datalist>
  </label>
</form>

#### Radio

<form>
  <label><input type="radio" name="language" value="HTML"> HTML</label><br>
  <label><input type="radio" name="language" value="CSS"> CSS</label><br>
  <label><input type="radio" name="language" value="JavaScript"> JavaScript</label>
</form>

#### Text

<form>
  <label>
    First name<br>
    <input type="text" placeholder="Placeholder">
  </label>
</form>

### Select

<form>
  <label>
    Label<br>
    <select>
      <option value="Earth">Select a planet...</option>
      <option value="Earth">Earth</option>
      <option value="Jupiter">Jupiter</option>
      <option value="Mars">Mars</option>
      <option value="Mercury">Mercury</option>
      <option value="Neptune">Neptune</option>
      <option value="Saturn">Saturn</option>
      <option value="Uranus">Uranus</option>
      <option value="Venus">Venus</option>
    </select>
  </label>
</form>

### Textarea

<textarea rows="5" cols="40">
Ipsam totam tempora. Dolorum voluptas error tempore asperiores vitae error laboriosam autem possimus.
</textarea>

## Headings

# Heading 1 {docsify-ignore}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse luctus nulla eu ex varius, a varius elit tincidunt. Aenean arcu magna, gravida id purus a, interdum convallis turpis. Aenean id ipsum eu tortor sollicitudin scelerisque in quis elit.

## Heading 2 {docsify-ignore}

Vestibulum lobortis laoreet nunc vel vulputate. In et augue non lectus pellentesque molestie et ac justo. Sed sed turpis ut diam gravida sagittis nec at neque. Vivamus id tellus est. Nam ac dignissim mi. Vestibulum nec sem convallis, condimentum augue at, commodo diam.

### Heading 3 {docsify-ignore}

Suspendisse sit amet tincidunt nibh, ac interdum velit. Ut orci diam, dignissim at enim sit amet, placerat rutrum magna. Mauris consectetur nibh eget sem feugiat, sit amet congue quam laoreet. Curabitur sed massa metus.

#### Heading 4 {docsify-ignore}

Donec odio orci, facilisis ac vehicula in, vestibulum ut urna. Ut bibendum ullamcorper risus, ac euismod leo maximus sed. In pulvinar sagittis rutrum. Morbi quis cursus diam. Cras ac laoreet nulla, rhoncus sodales dui.

##### Heading 5 {docsify-ignore}

Commodo sit veniam nulla cillum labore ullamco aliquip quis. Consequat nulla fugiat consequat ex duis proident. Adipisicing excepteur tempor exercitation ad. Consectetur voluptate Lorem sint elit exercitation ullamco dolor.

###### Heading 6 {docsify-ignore}

Ipsum ea amet dolore mollit incididunt fugiat nulla laboris est sint voluptate. Ex culpa id amet ipsum amet pariatur ipsum officia sit laborum irure ullamco deserunt. Consequat qui tempor occaecat nostrud proident.

## Horizontal Rule

Text

---

Text

## IFrame

[Example](_media/example.html ':include height=200px')

## Images

#### Inline-style

![Docsify Logo](/_media/icon.svg 'This is the Docsify logo!')

#### Reference-style

![Docsify Logo][logo]

[logo]: /_media/icon.svg 'This is the Docsify logo!'

#### Light / Dark Theme

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="_media/moon.svg">
  <source media="(prefers-color-scheme: light)" srcset="_media/sun.svg">
  <img alt="BinaryTree" src="_media/sun.svg" width="122">
</picture>

## Keyboard

<kbd>&uarr;</kbd> Arrow Up

<kbd>&darr;</kbd> Arrow Down

<kbd>&larr;</kbd> Arrow Left

<kbd>&rarr;</kbd> Arrow Right

<kbd>&#8682;</kbd> Caps Lock

<kbd>&#8984;</kbd> Command

<kbd>&#8963;</kbd> Control

<kbd>&#9003;</kbd> Delete

<kbd>&#8998;</kbd> Delete (Forward)

<kbd>&#8600;</kbd> End

<kbd>&#8996;</kbd> Enter

<kbd>&#9099;</kbd> Escape

<kbd>&#8598;</kbd> Home

<kbd>&#8670;</kbd> Page Up

<kbd>&#8671;</kbd> Page Down

<kbd>&#8997;</kbd> Option, Alt

<kbd>&#8629;</kbd> Return

<kbd>&#8679;</kbd> Shift

<kbd>&#9251;</kbd> Space

<kbd>&#8677;</kbd> Tab

<kbd>&#8676;</kbd> Tab + Shift

<kbd>&#8963;</kbd><kbd>&#8997;</kbd><kbd>&#9003;</kbd>

<kbd>Ctrl</kbd><kbd>Alt</kbd><kbd>Del</kbd>

<kbd>&#8963; Ctrl</kbd><kbd>&#8997; Alt</kbd><kbd>&#9003; Del</kbd>

<kbd>Control</kbd><kbd>Alt</kbd><kbd>Delete</kbd>

<kbd>&#8963; Control</kbd><kbd>&#8997; Alt</kbd><kbd>&#9003; Delete</kbd>

## Links

[Inline link](https://google.com)

[Inline link with title](https://google.com 'Google')

[Reference link by name][link1]

[Reference link by number][1]

[Reference link by self]

[link1]: https://google.com
[1]: https://google.com
[Reference link by self]: https://google.com

## Lists

### Ordered List

1. Ordered
1. Ordered
   1. Nested
   1. Nested (Wrapping): Similique tempora et. Voluptatem consequuntur ut. Rerum minus et sed beatae. Consequatur ut nemo laboriosam quo architecto quia qui. Corrupti aut omnis velit.
1. Ordered (Wrapping): Error minima modi rem sequi facere voluptatem. Est nihil veritatis doloribus et corporis ipsam. Pariatur eos ipsam qui odit labore est voluptatem enim. Veritatis est qui ut pariatur inventore.

### Unordered List

- Unordered
- Unordered
  - Nested
  - Nested (Wrapping): Quia consectetur sint vel ut excepturi ipsa voluptatum suscipit hic. Ipsa error qui molestiae harum laboriosam. Rerum non amet illo voluptatem odio pariatur. Ut minus enim.
- Unordered (Wrapping): Fugiat qui tempore ratione amet repellendus repudiandae non. Rerum nisi officia enim. Itaque est alias voluptatibus id molestiae accusantium. Cupiditate sequi qui omnis sed facere aliquid quia ut.

### Task List

- [x] Task
- [ ] Task
  - [ ] Subtask
  - [ ] Subtask
  - [x] Subtask
- [ ] Task (Wrapping): Earum consequuntur itaque numquam sunt error omnis ipsum repudiandae. Est assumenda neque eum quia quisquam laborum beatae autem ad. Fuga fugiat perspiciatis harum quia dignissimos molestiae. Officia quo eveniet tempore modi voluptates consequatur. Eum odio adipisci labore.
  - [x] Subtask (Wrapping): Vel possimus eaque laborum. Voluptates qui debitis quaerat atque molestiae quia explicabo doloremque. Reprehenderit perspiciatis a aut impedit temporibus aut quasi quia. Incidunt sed recusandae vitae asperiores sit in.

## Output

<output data-lang="output">
  <p>Et cum fugiat nesciunt voluptates. A atque quos doloribus dolorem quo. Et dignissimos omnis nam. Recusandae voluptatem nam. Tenetur veniam et qui consequatur. Aut sequi atque fuga itaque iusto eum nihil quod iure.</p>
  <ol>
    <li>Item</li>
    <li>Item</li>
    <li>Item</li>
  </ol>
</output>

## Tables

### Alignment

| Left Align | Center Align | Right Align | Non&#8209;Breaking&nbsp;Header |
| ---------- | :----------: | ----------: | ------------------------------ |
| A1         |      A2      |          A3 | A4                             |
| B1         |      B2      |          B3 | B4                             |
| C1         |      C2      |          C3 | C4                             |

### Headerless

|     |     |     |     |
| --- | --- | --- | --- |
| A1  | A2  | A3  | A4  |
| B1  | B2  | B3  | B4  |
| C1  | C2  | C3  | C4  |

### Scrolling

| Header                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Dicta&nbsp;in&nbsp;nobis&nbsp;dolor&nbsp;adipisci&nbsp;qui.&nbsp;Accusantium&nbsp;voluptates&nbsp;est&nbsp;dolor&nbsp;laboriosam&nbsp;qui&nbsp;voluptatibus.&nbsp;Veritatis&nbsp;eos&nbsp;aspernatur&nbsp;iusto&nbsp;et&nbsp;dicta&nbsp;quas.&nbsp;Fugit&nbsp;voluptatem&nbsp;dolorum&nbsp;qui&nbsp;quisquam.&nbsp;nihil |
| Aut&nbsp;praesentium&nbsp;officia&nbsp;aut&nbsp;delectus.&nbsp;Quas&nbsp;atque&nbsp;reprehenderit&nbsp;saepe.&nbsp;Et&nbsp;voluptatibus&nbsp;qui&nbsp;dolores&nbsp;rem&nbsp;facere&nbsp;in&nbsp;dignissimos&nbsp;id&nbsp;aut.&nbsp;Debitis&nbsp;excepturi&nbsp;delectus&nbsp;et&nbsp;quos&nbsp;numquam&nbsp;magnam.      |
| Sed&nbsp;eum&nbsp;atque&nbsp;at&nbsp;laborum&nbsp;aut&nbsp;et&nbsp;repellendus&nbsp;ullam&nbsp;dolor.&nbsp;Cupiditate&nbsp;saepe&nbsp;voluptatibus&nbsp;odit&nbsp;est&nbsp;pariatur&nbsp;qui.&nbsp;Hic&nbsp;sunt&nbsp;nihil&nbsp;optio&nbsp;enim&nbsp;eum&nbsp;laudantium.&nbsp;Repellendus&nbsp;voluptate.              |

## Text Elements

<mark>Marked text</mark>

<pre>Preformatted text</pre>

<samp>Sample Output</samp>

<small>Small Text</small>

This is <sub>subscript</sub>

This is <sup>superscript</sup>

<ins>Underlined Text</ins>

## Text Styles

Body text

**Bold text**

_Italic text_

**_Bold and italic text_**

~~Strikethrough~~
