document.oncontextmenu = new Function('event.returnValue=false')
document.onselectstart = new Function('event.returnValue=false')
// window.onkeydown = window.onkeyup = window.onkeypress = function () {
//    window.event.returnValue = false;
//    return false;
// }
for (var i = 1; i < 4; i++) { console.warn(i + '.仅供本网址查看，禁止非法获取（采集）数据；违者后果自负。') }

function consoleOpenCallback() {
  document.body.innerHTML = ''
  alert('仅供本网址查看，禁止非法获取（采集）数据；违者后果自负。')
  !(function() {
    setInterval(function() {
      debugger
    }, 1000)
  }())
}

!(function() {
  const handler = setInterval(function() {
    const before = new Date()
    debugger
    const after = new Date()
    const cost = after.getTime() - before.getTime()
    if (cost > 100) {
      consoleOpenCallback()
      // clearInterval(handler)
    }
  }, 1000)
}())
