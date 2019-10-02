from browser import console, document, html, window


class Menu:

    def __init__(self, container=document.body, parent=None):
        self.container = container
        self.parent = parent
        self._table = html.TABLE(Class="menu-table")
        self.panel = html.TR(Class="menu-st1")
        self._table <= self.panel
        self.container <= self._table
        cstyle = window.getComputedStyle(self.container)
        self.fontSize = cstyle.getPropertyValue('font-size')

        document.bind("click", self.hide_menus)

    def _make_item(self, name):
        if self.parent is None:
            # First level
            td = html.TD(name, Class="menu-li-style1 top")
        else:
            # Next levels
            td = html.TD(name, Class="menu-li-style2 sub")
        td.style.fontSize = self.fontSize
        self.panel <= td
        return td

    def add_item(self, name, callback=None):
        td = self._make_item(name)
        def deco(callback):
            def f(ev):
                for div in document.select(".submenu"):
                    div.style.display = "none"
                ev.stopPropagation()
                ev.preventDefault()
                if callback is not None:
                    return callback(ev)
            td.bind("click", f)
            return f
        return deco

    def add_menu(self, name):
        """Add a new submenu in the current menu."""
        if self.parent is not None:
            name += "..."
        td = self._make_item(name)
        # create a DIV for the submenu
        div = html.DIV(Class="menu-div submenu")
        if self.parent is None:
            div.style.left = f"{td.abs_left}px"
            div.style.top = f"{td.abs_top + td.offsetHeight}px"
        else:
            left = self.container.abs_left + self.container.offsetWidth
            div.style.left = f"{left}px"
            div.style.top = f"{td.abs_top}px"
        div.style.fontSize = self.fontSize
        div.style.display = "none"
        document <= div
        td.bind("click", lambda ev: self.unfold(ev, div))
        return Menu(div, self)

    def hide_menus(self, ev):
        """When user clicks outside of open submenus, close them all."""
        for div in document.select(".submenu"):
            div.style.display = "none"

    def unfold(self, event, element):
        """Called when a label with a submenu is clicked."""
        if event.target.class_name != "sub":
            self.hide_menus(event)

        element.style.display = "block"
        if event.target.class_name == "sub":
            # compute position of element
            container = event.target.closest("DIV")
            left = container.abs_left + container.offsetWidth
            element.style.left = f"{left}px"
            element.style.top = f"{event.target.abs_top}px"
        else:
            element.style.left = f"{event.target.abs_left}px"
            top = event.target.abs_top + event.target.offsetHeight
            element.style.top = f"{top}px"
        event.stopPropagation() # to avoid calling hide_menus() again