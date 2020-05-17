// обект и его функция определяющие по какому url запросу какую страницу загружать
var Route = {};
Route.path = function (route, callback) {
  Route[route] = callback;
};


function doGet(e) {
  Route.path("main", loadMainPage);
  if (Route[e.parameters.v]) {
    return Route[e.parameters.v]();
  };
}

function loadMainPage() {
  return render("index", {});
};

// рендерит наши шаблоны (https://www.youtube.com/watch?v=9LHPU0dYyrU)
function render(file, argsObject) {
   var template = HtmlService.createTemplateFromFile(file);
   if (argsObject) {
      var keys = Object.keys(argsObject);
      keys.forEach(function (key) {
         template[key] = argsObject[key];
      });
      return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
   }
};

// эта маленькая функция нужна для встраивания кода в  HTML страницу
function include(filename) {
   return HtmlService.createHtmlOutputFromFile(filename).getContent();
};
