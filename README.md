brython-widgets is a collection of widgets that can be used by [Brython](https://brython.info) programs.

# Inclusion in a Brython page

The package can be included in an HTML page by
```xml
<script src="https://cdn.jsdelivr.net/gh/PierreQuentel/brython-widgets/brython-widgets.brython.js"></script>
```

# menu

The module __`menu`__ exposes a single class:

`Menu([container])`

> creates a menu inside the _container_, usually a `<DIV>` element in the page.
> If _container_ is not specified, the menu is put at document level.

Instances of `Menu` have 2 methods:

`add_item(text)`

> adds an item in the menu with the specified _text_. The method returns a
> decorator. When the user clicks on the item, the decorated function is
> called

`add_menu(text)`

> adds a submenu to the current menu with the specified _text_. When the user
> clicks on the text, the submenu is displayed. A submenu is an instance of
> the `Menu` class, so that other items and submenus can be added to it with
> the same methods `add_item()` and `add_menu()`

# dialog

The module __`dialog`__ exposes classes used to display various sorts of
dialog boxes.

All the boxes have a title bar, with a text and a "close" button. The text is
set by the parameter _title_ in all dialog classes.

By default, dialog boxes are centered on the page. The _top_ and _left_
positions can be passed as parameters.

`InfoDialog(title="", message="", top=None, left=None, remove_after=None)`

> displays an information dialog.
>
> - _message_ is the information message
> - _remove_after_ is the number of seconds after which the dialog box is
>   removed

`EntryDialog(title="", message=None, top=None, left=None)`

> displays a box with an input zone. When the user hits the "Ok" button or
> the Enter key, the widget triggers a custom event called "entry". In the
> callback function associated to this event, the attribute `value` of the
> `EntryDialog` instance is set to the text entered in the input zone.

> Example:

```python
from browser import bind
import dialog

entry = dialog.EntryDialog("Widgets test", "File name")
@bind(entry, "entry")
def handle(evt):
    entry.remove()
    dialog.InfoDialog("Widgets test", entry.value)
```

`Dialog(title="", top=None, left=None, ok_cancel=False)`

> generic class for dialog boxes.
>
> - _ok_cancel_ determines if the box should have the two buttons "Ok" and
>   "cancel"
>
> Instances of `Dialog` have an attribute `panel` where HTML elements can be
> added by the usual Brython syntax.
>
> Example:

```python
from browser import html
import dialog

themes = ["Sunrize", "Day", "Evening", "Sunset", "Night"]
themes_dialog = dialog.Dialog("Widgets test", ok_cancel=True)
selector = html.SELECT(html.OPTION(theme) for theme in themes)
themes_dialog.panel <= selector

@bind(selector, "change")
def choose_theme(evt):
    chosen = selector.options[selector.selectedIndex].value
    themes_dialog.remove()
    dialog.InfoDialog("Widgets test", f"Selected: {chosen}")
```


