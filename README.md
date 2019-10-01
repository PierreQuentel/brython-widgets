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

All the boxes have a title bar, with a text and a "close" button.

By default, dialog boxes are centered on the page. The _top_ and _left_
positions can be passed as parameters.

`InfoDialog([title, message, top, left, remove_after])`

> displays an information dialog.
>
> - _title_ is the text on the title bar
> - _message_ is the information message
> - _remove_after_ is the number of seconds after which the dialog box is
>   removed
