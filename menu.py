from browser import bind, console, document, html, timer, window


class Menu:

    def __init__(self, container=document.body, parent=None):
        self.container = container
        self.parent = parent
        if parent is None:
            self._table = html.TABLE(Class="menu-table")
            self.panel = html.TR(Class="menu-row")
            self._table <= self.panel
            self.container <= self._table

            self.panel.bind("mouseover", self.hide_submenus)

            document.bind("click", self.reset)

        else:
            self.panel = html.TABLE(Class="menu-table")
            self.container <= self.panel

        @bind(self.panel, "click")
        def click(evt):
            evt.stopPropagation()

        cstyle = window.getComputedStyle(self.container)
        self.fontSize = cstyle.getPropertyValue('font-size')
        self.selecting = False
        container.open_child = None

    def _make_item(self, name):
        if self.parent is None:
            # Add item to main menu bar
            td = html.TD(name, Class="menu-item-top")
            self.panel <= td
        else:
            # Add item to submenu
            td = html.TD(name, Class="menu-item-sub")
            self.panel <= html.TR(td)
        td.style.fontSize = self.fontSize
        return td

    def add_item(self, name, callback=None):
        td = self._make_item(name)
        self.ignore_dblclick(td)

        def deco(callback):
            def f(ev):
                # Remove all submenus
                for div in document.select(".submenu"):
                    div.style.display = "none"
                ev.stopPropagation()
                ev.preventDefault()
                if callback is not None:
                    return callback(ev)
            td.bind("click", f)

            @bind(td, "mouseover")
            def mouseover(evt):
                # In a submenu at level n, entering an item hides the
                # submenu possibly open at level n + 1
                if self.parent and self.container.open_child:
                    self.container.open_child.style.display = "none"
                    self.container.open_child = None

            return f

        return deco

    def add_menu(self, name):
        """Add a new submenu in the current menu."""
        if self.parent is not None:
            name += "..."
        td = self._make_item(name)
        # create a DIV for the submenu
        div = html.DIV(Class="submenu")
        div.open_child = None
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
        if self.parent is None:
            @bind(td, "click")
            def click(ev):
                if not self.selecting:
                    self.hide_submenus()
                    self.unfold(ev, div)

            @bind(td, "mouseover")
            def mouseover(ev):
                if self.selecting:
                    self.hide_submenus()
                    self.unfold(ev, div)
        else:
            @bind(td, "mouseover")
            def unfold(ev):
                self.unfold(ev, div)

        self.ignore_dblclick(td)

        return Menu(div, self)

    def hide(self, *args):
        """When user clicks outside of open submenus, close them all."""
        if self.parent is not None:
            self.container.style.display = "none"


    def hide_submenus(self, *args):
        """When user clicks outside of an item in the menu bar,
        close all submenus."""
        for div in document.select(".submenu"):
            div.style.display = "none"

    def ignore_dblclick(self, elt):
        @bind(elt, "mousedown")
        def dblclick(ev):
            if ev.detail > 1:
                print("double click")
                ev.preventDefault()
                ev.stopPropagation()


    def reset(self, evt):
        self.hide_submenus()
        for td in self.panel:
            td.classList.remove("menu-item-top-selected")
            td.classList.add("menu-item-top")
            self.selecting = False

    def unfold(self, event, element):
        """Called when a label with a submenu is clicked."""
        mdiv = event.target.closest("div")
        if mdiv.open_child:
            mdiv.open_child.style.display = "none"

        if event.target.class_name != "menu-item-sub":
            # Click on an item of the main menu bar
            self.hide()
            for td in event.target.parent:
                td.classList.remove("menu-item-top")
                td.classList.add("menu-item-top-selected")
            self.selecting = True

        element.style.display = "block"
        mdiv.open_child = element
        if event.target.class_name == "menu-item-sub":
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