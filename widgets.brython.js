__BRYTHON__.use_VFS = true;
var scripts = {"$timestamp": 1572118797413, "widgets.dialog": [".py", "from browser import console,document,html,window\n\n\nclass Dialog(html.DIV):\n ''\n\n\n\n\n\n \n \n def __init__(self,title=\"\",top=None ,left=None ,ok_cancel=False ):\n  html.DIV.__init__(self,Class=\"dialog\")\n  self._title=html.DIV(html.SPAN(title),Class=\"dialog-title\")\n  self <=self._title\n  btn=html.SPAN(\"&times;\",Class=\"dialog-close\")\n  self._title <=btn\n  btn.bind(\"click\",self.remove)\n  self.panel=html.DIV(Class=\"dialog-panel\")\n  self <=self.panel\n  \n  if ok_cancel:\n   ok_cancel_zone=html.DIV(style={\"text-align\":\"center\"})\n   self.ok_button=html.BUTTON(\"Ok\")\n   self.cancel_button=html.BUTTON(\"Cancel\")\n   self.cancel_button.bind(\"click\",self.remove)\n   ok_cancel_zone <=self.ok_button+self.cancel_button\n   self <=ok_cancel_zone\n   \n  document <=self\n  cstyle=window.getComputedStyle(self)\n  \n  \n  if left is None :\n   width=round(float(cstyle.width[:-2]))\n   left=int((window.innerWidth -width)/2)\n  self.left=left\n  self.style.left=f'{left}px'\n  if top is None :\n   height=round(float(cstyle.height[:-2]))\n   top=int((window.innerHeight -height)/2)\n  self.top=top\n  self.style.top=f'{top}px'\n  \n  self._title.bind(\"mousedown\",self.mousedown)\n  document.bind(\"mousemove\",self.mousemove)\n  self._title.bind(\"mouseup\",self.mouseup)\n  self.is_moving=False\n  \n def mousedown(self,event):\n  self.is_moving=True\n  self.offset=[self.left -event.x,self.top -event.y]\n  \n  event.preventDefault()\n  \n def mousemove(self,event):\n  if not self.is_moving:\n   return\n   \n   \n  self.left=self.offset[0]+event.x\n  self.top=self.offset[1]+event.y\n  \n def mouseup(self,event):\n  self.is_moving=False\n  \nclass EntryDialog(Dialog):\n ''\n\n\n\n\n\n\n\n\n\n \n \n def __init__(self,title=\"\",message=\"\",top=None ,left=None ):\n  Dialog.__init__(self,title,top,left,ok_cancel=True )\n  if message:\n   self.panel <=message\n  self.entry=html.INPUT()\n  self.panel <=html.BR()+self.entry\n  self.entry.focus()\n  \n  self.entry.bind(\"keypress\",self.callback)\n  self.ok_button.bind(\"click\",self.callback)\n  \n @property\n def value(self):\n  return self.entry.value\n  \n def callback(self,evt):\n  if evt.target ==self.entry and evt.keyCode !=13:\n   return\n  self.dispatchEvent(window.Event.new(\"entry\"))\n  \nclass InfoDialog(Dialog):\n ''\n \n def __init__(self,title=\"\",message=\"\",top=None ,left=None ,\n remove_after=None ):\n  ''\n  \n  Dialog.__init__(self,title,top,left)\n  self.panel <=message\n  if remove_after:\n   if not isinstance(remove_after,(int,float)):\n    raise TypeError(\"remove_after should be a number, not \"+\n    str(remove_after.__class__.__name__))\n   window.setTimeout(self.remove,remove_after *1000)\n", ["browser"]], "widgets.menu": [".py", "from browser import bind,console,document,html,timer,window\n\n\nclass Menu:\n\n def __init__(self,container=document.body,parent=None ):\n  self.container=container\n  self.parent=parent\n  if parent is None :\n   self._table=html.TABLE(Class=\"menu-table\")\n   self.panel=html.TR(Class=\"menu-row\")\n   self._table <=self.panel\n   self.container <=self._table\n   \n   self.panel.bind(\"mouseover\",self.hide_submenus)\n   \n   document.bind(\"click\",self.reset)\n   \n  else :\n   self.panel=html.TABLE(Class=\"menu-table\")\n   self.container <=self.panel\n   \n  @bind(self.panel,\"click\")\n  def click(evt):\n   evt.stopPropagation()\n   \n  cstyle=window.getComputedStyle(self.container)\n  self.fontSize=cstyle.getPropertyValue('font-size')\n  self.selecting=False\n  container.open_child=None\n  \n def _make_item(self,name):\n  if self.parent is None :\n  \n   td=html.TD(name,Class=\"menu-item-top\")\n   self.panel <=td\n  else :\n  \n   td=html.TD(name,Class=\"menu-item-sub\")\n   self.panel <=html.TR(td)\n  td.style.fontSize=self.fontSize\n  return td\n  \n def add_item(self,name,callback=None ):\n  td=self._make_item(name)\n  self.ignore_dblclick(td)\n  \n  def deco(callback):\n   def f(ev):\n   \n    for div in document.select(\".submenu\"):\n     div.style.display=\"none\"\n    ev.stopPropagation()\n    ev.preventDefault()\n    if callback is not None :\n     return callback(ev)\n   td.bind(\"click\",f)\n   \n   @bind(td,\"mouseover\")\n   def mouseover(evt):\n   \n   \n    if self.parent and self.container.open_child:\n     self.container.open_child.style.display=\"none\"\n     self.container.open_child=None\n     \n   return f\n   \n  return deco\n  \n def add_menu(self,name):\n  ''\n  if self.parent is not None :\n   name +=\"...\"\n  td=self._make_item(name)\n  \n  div=html.DIV(Class=\"submenu\")\n  div.open_child=None\n  if self.parent is None :\n   div.style.left=f\"{td.abs_left}px\"\n   div.style.top=f\"{td.abs_top + td.offsetHeight}px\"\n  else :\n   left=self.container.abs_left+self.container.offsetWidth\n   div.style.left=f\"{left}px\"\n   div.style.top=f\"{td.abs_top}px\"\n  div.style.fontSize=self.fontSize\n  div.style.display=\"none\"\n  document <=div\n  if self.parent is None :\n   @bind(td,\"click\")\n   def click(ev):\n    if not self.selecting:\n     self.hide_submenus()\n     self.unfold(ev,div)\n     \n   @bind(td,\"mouseover\")\n   def mouseover(ev):\n    if self.selecting:\n     self.hide_submenus()\n     self.unfold(ev,div)\n  else :\n   @bind(td,\"mouseover\")\n   def unfold(ev):\n    self.unfold(ev,div)\n    \n  self.ignore_dblclick(td)\n  \n  return Menu(div,self)\n  \n def hide(self,*args):\n  ''\n  if self.parent is not None :\n   self.container.style.display=\"none\"\n   \n   \n def hide_submenus(self,*args):\n  ''\n  \n  for div in document.select(\".submenu\"):\n   div.style.display=\"none\"\n   \n def ignore_dblclick(self,elt):\n  @bind(elt,\"mousedown\")\n  def dblclick(ev):\n   if ev.detail >1:\n    ev.preventDefault()\n    \n def reset(self,evt):\n  self.hide_submenus()\n  for td in self.panel:\n   td.classList.remove(\"menu-item-top-selected\")\n   td.classList.add(\"menu-item-top\")\n   self.selecting=False\n   \n def unfold(self,event,element):\n  ''\n  mdiv=event.target.closest(\"div\")\n  if mdiv.open_child:\n   mdiv.open_child.style.display=\"none\"\n   \n  if event.target.class_name !=\"menu-item-sub\":\n  \n   self.hide()\n   for td in event.target.parent:\n    td.classList.remove(\"menu-item-top\")\n    td.classList.add(\"menu-item-top-selected\")\n   self.selecting=True\n   \n  element.style.display=\"block\"\n  mdiv.open_child=element\n  if event.target.class_name ==\"menu-item-sub\":\n  \n   container=event.target.closest(\"DIV\")\n   left=container.abs_left+container.offsetWidth\n   element.style.left=f\"{left}px\"\n   element.style.top=f\"{event.target.abs_top}px\"\n  else :\n   element.style.left=f\"{event.target.abs_left}px\"\n   top=event.target.abs_top+event.target.offsetHeight\n   element.style.top=f\"{top}px\"\n  event.stopPropagation()\n", ["browser"]], "widgets": [".py", "", [], 1], "widgets.sub.a": [".py", "x=9\n", []]}
__BRYTHON__.update_VFS(scripts)
