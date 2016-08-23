var apiRecipe = '/api/labfnp/recipe/';
var recipeId = $('input[name="id"]').val();
var pieHeader = {
  "title": {
    "text": "",
    "fontSize": 24,
    "font": "open sans"
  },
  "subtitle": {
    "text": "",
    "color": "#999999",
    "fontSize": 12,
    "font": "open sans"
  },
  "titleSubtitlePadding": 9
};
var pieFooter = {
  "color": "#999999",
  "fontSize": 10,
  "font": "open sans",
  "location": "bottom-left"
};
var pieSize = {
  "canvasWidth": 230,
  "canvasHeight": 230,
  "pieOuterRadius": "75%"
};
var pieDate = {
  "sortOrder": "value-desc",
  "content": [],
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "hideWhenLessThanPercentage": 3
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    },
    "truncation": {
      "enabled": true
    },
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "elastic",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  },
};
var ajaxSuccess = function (result) {
  for (var i=0; i<result.data.formula.length; i++) {
    pieDate.content.push({
      label: result.data.formula[i].scent,
      value: parseInt(result.data.formula[i].drops),
      color: result.data.formula[i].color,
    });
  }
	var pie = new d3pie("pieChart", {
		"header": pieHeader,
		"footer": pieFooter,
		"size": pieSize,
		"data": pieDate,
	});
}; // end ajaxSuccess
var ajaxError = function (requestObject, error, errorThrown) {
  sweetAlert("錯誤", "目前無法取得此配方成份！", "error");
  console.log('[requestObject]=>', requestObject);
  console.log('[error]=>', errorThrown);
  console.log('[errorThrown]=>', error);
} // end ajaxError
$.get(apiRecipe + recipeId).done(ajaxSuccess).fail(ajaxError);

$("#likeButton").on("click", function (event) {
	event.preventDefault()
	var id = $(this).data('id');
	var that = $(this);
	var isLike = that.data('like');
	var successCatch = function (result) {
		console.log(result.responseJSON);
		var like = that.data('like');
		that.data('like', !like);
		that.find("i").toggleClass("fa-heart");
		that.find("i").toggleClass("fa-heart-o");
	}
	var failCatch = function (error) {
		if (error.responseJSON.message === 'permission denied') {
      swal({
        title: '請先登入',
        text: '如果要使用收藏功能，請先進行登入。',
      	type: 'warning',
      });
		}
	}
	if (isLike) {
		$.get('/api/labfnp/recipe/unlike/' + id).done(successCatch).fail(failCatch);
	} else {
		$.get('/api/labfnp/recipe/like/' + id).done(successCatch).fail(failCatch);
	}
})


var fill = d3.scale.category20();

var layout = d3.layout.cloud()
    .size([230, 230])
    .words(["木質","日曬干草","紙味","沉靜","和平","日式房子","小木屋","大樹","清爽的樹皮","老舊的","風吹過木頭","走在阿公家","男人味","帥的人味","溫柔男子","中年客人的味道","CK味","噴太多古龍水","外國人","暖甜","柔和","厚實","深沈","辛辣","酒吧","蒸餾酒","瑪格麗特（調酒）","Vodka","琥珀","古龍水","森林","芬多精","麥克筆的味道","顏料","膨膨沐浴露","木質香","水果香","濃郁","甜","花蜜","繡球花","清新","薄荷糖","深沈","酸","酸豆","叛逆","麥克筆","指甲油","香蕉油"]
    .map(function(d) {
      return {text: d, size: 2 + Math.random() * 20, test: "haha"};
    }))
    .padding(5)
    .rotate(function() { return 0; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);

layout.start();

function draw(words) {
  d3.select("#cloud").append("svg")
      .attr("width", layout.size()[0])
      .attr("height", layout.size()[1])
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
    .selectAll("text")
      .data(words)
    .enter().append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
}
