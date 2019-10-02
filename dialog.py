from browser import console, document, html, window


class Dialog(html.DIV):
    """Basic, moveable dialog box with a title bar, optional
    "Ok" / "Cancel" buttons.
    The "Ok" button is the attribute "ok_button" of the dialog object.
    Supports drag and drop on the document.
    A dialog has an attribute "panel" that can contain elements.
    Method close() removes the dialog box.
    """

    def __init__(self, title="", top=None, left=None, ok_cancel=False):
        html.DIV.__init__(self, Class="dialog")
        self._title = html.DIV(html.SPAN(title), Class="dialog-title")
        self <= self._title
        btn = html.SPAN("&times;", Class="dialog-close")
        self._title <= btn
        btn.bind("click", self.close)
        self.panel = html.DIV(Class="dialog-panel")
        self <= self.panel

        if ok_cancel:
            ok_cancel_zone = html.DIV(style={"text-align": "center"})
            self.ok_button = html.BUTTON("Ok")
            self.cancel_button = html.BUTTON("Cancel")
            self.cancel_button.bind("click", self.close)
            ok_cancel_zone <= self.ok_button + self.cancel_button
            self <= ok_cancel_zone

        document <= self
        cstyle = window.getComputedStyle(self)

        # Center horizontally and vertically
        if left is None:
            width = round(float(cstyle.width[:-2]))
            left = int((window.innerWidth - width) / 2)
        self.left = left
        self.style.left = f'{left}px'
        if top is None:
            height = round(float(cstyle.height[:-2]))
            top = int((window.innerHeight - height) / 2)
        self.top = top
        self.style.top = f'{top}px'

        self._title.bind("mousedown", self.mousedown)
        document.bind("mousemove", self.mousemove)
        self._title.bind("mouseup", self.mouseup)
        self.bind("leave", self.mouseup)
        self.is_moving = False

    def close(self, *args):
        self.remove()

    def mousedown(self, event):
        self.is_moving = True
        self.offset = [self.left - event.x, self.top - event.y]
        # prevent default behaviour to avoid selecting the moving element
        event.preventDefault()

    def mousemove(self, event):
        if not self.is_moving:
            return

        # set new moving element coordinates
        self.left = self.offset[0] + event.x
        self.top = self.offset[1] + event.y

    def mouseup(self, event):
        self.is_moving = False

class EntryDialog(Dialog):
    """Dialog box with "Ok / Cancel" buttons and an INPUT element.
    When the user clicks on "Ok" or hits the Enter key, an event called
    "entry" is triggered on the element.

    Usage:
        box = EntryDialog()

        @bind(box, "entry")
        def entry(evt):
            ...
    """

    def __init__(self, title="", message="", top=None, left=None):
        Dialog.__init__(self, title, top, left, ok_cancel=True)
        if message:
            self.panel <= message
        self.entry = html.INPUT()
        self.panel <= html.BR() + self.entry
        self.entry.focus()

        self.entry.bind("keypress", self.callback)
        self.ok_button.bind("click", self.callback)

    @property
    def value(self):
        return self.entry.value

    def callback(self, evt):
        if evt.target == self.entry and evt.keyCode != 13:
            return
        self.dispatchEvent(window.Event.new("entry"))

class InfoDialog(Dialog):
    """Dialog box with an information message and no "Ok / Cancel" button."""

    def __init__(self, title="", message="", top=None, left=None,
            remove_after=None):
        """If remove_after is set, number of seconds after which the dialog is
        removed."""
        Dialog.__init__(self, title, top, left)
        self.panel <= message
        if remove_after:
            if not isinstance(remove_after, (int, float)):
                raise TypeError("remove_after should be a number, not " +
                    str(remove_after.__class__.__name__))
            window.setTimeout(self.close, remove_after * 1000)