__BRYTHON__.use_VFS = true;
var scripts = {
    "$timestamp": 1569933616584,
    "widgets.dialog": [
        ".py",
        "from browser import console,document,html,window\n\n\nclass Dialog(html.DIV):\n ''\n\n\n\n\n\n \n \n def __init__(self,title=\"\",top=None ,left=None ,ok_cancel=False ):\n  html.DIV.__init__(self,Class=\"dialog\")\n  self._title=html.DIV(html.SPAN(title),Class=\"dialog-title\")\n  self <=self._title\n  btn=html.SPAN(\"&times;\",Class=\"dialog-close\")\n  self._title <=btn\n  btn.bind(\"click\",self.close)\n  self.panel=html.DIV(Class=\"dialog-panel\")\n  self <=self.panel\n  \n  if ok_cancel:\n   ok_cancel_zone=html.DIV(style={\"text-align\":\"center\"})\n   self.ok_button=html.BUTTON(\"Ok\")\n   self.cancel_button=html.BUTTON(\"Cancel\")\n   self.cancel_button.bind(\"click\",self.close)\n   ok_cancel_zone <=self.ok_button+self.cancel_button\n   self <=ok_cancel_zone\n   \n  document <=self\n  cstyle=window.getComputedStyle(self)\n  \n  \n  if left is None :\n   width=round(float(cstyle.width[:-2]))\n   left=int((window.innerWidth -width)/2)\n  self.left=left\n  self.style.left=f'{left}px'\n  if top is None :\n   height=round(float(cstyle.height[:-2]))\n   top=int((window.innerHeight -height)/2)\n  self.top=top\n  self.style.top=f'{top}px'\n  \n  self._title.bind(\"mousedown\",self.mousedown)\n  document.bind(\"mousemove\",self.mousemove)\n  self._title.bind(\"mouseup\",self.mouseup)\n  self.bind(\"leave\",self.mouseup)\n  self.is_moving=False\n  \n def close(self,*args):\n  self.remove()\n  \n def mousedown(self,event):\n  self.is_moving=True\n  self.offset=[self.left -event.x,self.top -event.y]\n  \n  event.preventDefault()\n  \n def mousemove(self,event):\n  if not self.is_moving:\n   return\n   \n   \n  self.left=self.offset[0]+event.x\n  self.top=self.offset[1]+event.y\n  \n def mouseup(self,event):\n  self.is_moving=False\n  \nclass EntryDialog(Dialog):\n ''\n\n\n\n\n\n\n\n\n\n \n \n def __init__(self,title=\"\",message=\"\",top=None ,left=None ):\n  Dialog.__init__(self,title,top,left,ok_cancel=True )\n  if message:\n   self.panel <=message\n  self.entry=html.INPUT()\n  self.panel <=html.BR()+self.entry\n  self.entry.focus()\n  \n  self.entry.bind(\"keypress\",self.callback)\n  self.ok_button.bind(\"click\",self.callback)\n  \n @property\n def value(self):\n  return self.entry.value\n  \n def callback(self,evt):\n  if evt.target ==self.entry and evt.keyCode !=13:\n   return\n  self.dispatchEvent(window.Event.new(\"entry\"))\n  \nclass InfoDialog(Dialog):\n ''\n \n def __init__(self,title=\"\",message=\"\",top=None ,left=None ,\n remove_after=None ):\n  ''\n  \n  Dialog.__init__(self,title,top,left)\n  self.panel <=message\n  if remove_after:\n   if not isinstance(remove_after,(int,float)):\n    raise TypeError(\"remove_after should be a number, not \"+\n    str(remove_after.__class__.__name__))\n   window.setTimeout(self.close,remove_after *1000)\n",
        [
            "browser"
        ]
    ],
    "widgets.menu": [
        ".py",
        "from browser import console,document,html,window\n\n\nclass Menu:\n\n def __init__(self,container=document.body,parent=None ):\n  self.container=container\n  self.parent=parent\n  self._table=html.TABLE(Class=\"menu-table\")\n  self.panel=html.TR(Class=\"menu-st1\")\n  self._table <=self.panel\n  self.container <=self._table\n  cstyle=window.getComputedStyle(self.container)\n  self.fontSize=cstyle.getPropertyValue('font-size')\n  \n  document.bind(\"click\",self.hide_menus)\n  \n def _make_item(self,name):\n  if self.parent is None :\n  \n   td=html.TD(name,Class=\"menu-li-style1 top\")\n  else :\n  \n   td=html.TD(name,Class=\"menu-li-style2 sub\")\n  td.style.fontSize=self.fontSize\n  self.panel <=td\n  return td\n  \n def add_item(self,name,callback=None ):\n  td=self._make_item(name)\n  def deco(callback):\n   def f(ev):\n    for div in document.select(\".submenu\"):\n     div.style.display=\"none\"\n    ev.stopPropagation()\n    ev.preventDefault()\n    if callback is not None :\n     return callback(ev)\n   td.bind(\"click\",f)\n   return f\n  return deco\n  \n def add_menu(self,name):\n  ''\n  if self.parent is not None :\n   name +=\"...\"\n  td=self._make_item(name)\n  \n  div=html.DIV(Class=\"menu-div submenu\")\n  if self.parent is None :\n   div.style.left=f\"{td.abs_left}px\"\n   div.style.top=f\"{td.abs_top + td.offsetHeight}px\"\n  else :\n   left=self.container.abs_left+self.container.offsetWidth\n   div.style.left=f\"{left}px\"\n   div.style.top=f\"{td.abs_top}px\"\n  div.style.fontSize=self.fontSize\n  div.style.display=\"none\"\n  document <=div\n  td.bind(\"click\",lambda ev:self.unfold(ev,div))\n  return Menu(div,self)\n  \n def hide_menus(self,ev):\n  ''\n  for div in document.select(\".submenu\"):\n   div.style.display=\"none\"\n   \n def unfold(self,event,element):\n  ''\n  if event.target.class_name !=\"sub\":\n   self.hide_menus(event)\n   \n  element.style.display=\"block\"\n  if event.target.class_name ==\"sub\":\n  \n   container=event.target.closest(\"DIV\")\n   left=container.abs_left+container.offsetWidth\n   element.style.left=f\"{left}px\"\n   element.style.top=f\"{event.target.abs_top}px\"\n  else :\n   element.style.left=f\"{event.target.abs_left}px\"\n   top=event.target.abs_top+event.target.offsetHeight\n   element.style.top=f\"{top}px\"\n  event.stopPropagation()\n",
        [
            "browser"
        ]
    ],
    "widgets": [
        ".py",
        "",
        [],
        1
    ],
    "widgets.sub.a": [
        ".py",
        "x=9\n",
        []
    ],
    "widgets.sub": [
        ".py",
        "",
        [],
        1
    ]
}
__BRYTHON__.update_VFS(scripts)
