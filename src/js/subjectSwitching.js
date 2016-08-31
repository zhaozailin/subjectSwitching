/**
 * Created by zhaozl on 2016-07-19.
 */
var subjectSwitching = (function() {

    // 初始化UI
    var initUI = function($obj, list, targetId) {

        // 存储数据状态的对象
        var dataModel = {};

        // 初始化数据模型、UI状态
        _initDataUI(dataModel, list, $obj, targetId);

        var $input = $obj.children("input");
        $input.autocomplete({
            delay: 0,
            minLength: 0,
            autoFocus: true,
            source: function(requeset, response) {
                response(_filter(requeset.term, list));
            },
            focus: function() {
                return false;
            },
            select: function(event, ui) {
                for (var key in ui.item) {
                    if (ui.item.hasOwnProperty(key)) {
                        dataModel[key] = ui.item[key];
                    }
                }

                // 每次选择之后重新初始化左右按钮状态
                _initLeftRightAfterSelect(dataModel, list, $obj);

                // 触发select事件
                $(dataModel).trigger("select");

                return ui.item.text;
            }
        });

        // 监听上一个
        $obj.children("div.sub-switch-left").off("click").on("click", function() {
            _switchPrev(dataModel, list, $obj);
        });

        // 监听下一个
        $obj.children("div.sub-switch-right").off("click").on("click", function() {
            _switchNext(dataModel, list, $obj);
        });

        // 监听input点击
        $input.click(function() {
            $input.select();

            // 执行搜索
            $input.autocomplete("search", "");
        });

        return $(dataModel);
    };

    // 每次选择之后重新初始化左右按钮状态
    var _initLeftRightAfterSelect = function(dataModel, list, $obj) {
        var $left = $obj.children("div.sub-switch-left");
        var $right = $obj.children("div.sub-switch-right");

        // 选择的是第一条数据
        if (list[0].id === dataModel.id) {
            $left.addClass("sub-switch-disabled");
        }
        else {
            $left.removeClass("sub-switch-disabled");
        }

        // 选择的是最后一条数据
        if (list[list.length - 1].id === dataModel.id) {
            $right.addClass("sub-switch-disabled");
        }
        else {
            $right.removeClass("sub-switch-disabled");
        }
    };

    // 初始化数据模型、UI状态
    var _initDataUI = function(dataModel, list, $obj, targetId) {
        var $input = $obj.children("input");

        // 有数据
        if (list.length > 0) {

            // 有targetId，则设置对应的元素
            var targetObj = null;
            if (targetId) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id === targetId) {
                        targetObj = list[i];
                        break;
                    }
                }
            }

            // 没有targetId，默认设置第一个元素
            else {
                targetObj = list[0];
            }

            // 设置dataModel值
            for (var key in targetObj) {
                if (targetObj.hasOwnProperty(key)) {
                    dataModel[key] = targetObj[key];
                }
            }
            $input.val(targetObj.text);
        }

        // 无数据
        else {
            $input.val("");
        }

        // 无数据、没有指定元素、指定元素为第一个元素时，禁用左按钮
        if (list.length === 0 || !targetId || targetId === list[0].id) {
            $obj.children("div.sub-switch-left").addClass("sub-switch-disabled");
        }
        else {
            $obj.children("div.sub-switch-left").removeClass("sub-switch-disabled");
        }

        // 没有数据、只有一条数据、指定元素为最后一个元素时，禁用右按钮
        if (list.length <= 1 || targetId === list[list.length - 1].id) {
            $obj.children("div.sub-switch-right").addClass("sub-switch-disabled");
        }
        else {
            $obj.children("div.sub-switch-right").removeClass("sub-switch-disabled");
        }
    };

    // 通过关键字过滤
    var _filter = function(key, list) {
        var newList = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].text.toLowerCase().indexOf(key.toLowerCase()) === 0 || list[i].name.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                list[i].value = list[i].text;
                newList.push(list[i]);
            }
        }
        return newList;
    };

    // 切换上一个
    var _switchPrev = function(dataModel, list, $obj) {
        var $left = $obj.children("div.sub-switch-left");
        var $right = $obj.children("div.sub-switch-right");
        if ($left.hasClass("sub-switch-disabled")) {
            return;
        }

        var idx = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === dataModel.id) {
                idx = i;
                break;
            }
        }

        var nextModal = list[idx - 1];
        for (var key in nextModal) {
            if (nextModal.hasOwnProperty(key)) {
                dataModel[key] = nextModal[key];
            }
        }

        // 设置dom
        $obj.children("input").val(nextModal.text);

        // 激活右按钮
        $right.removeClass("sub-switch-disabled");

        // 如果是第一个，则禁用左按钮
        if (idx === 1) {
            $left.addClass("sub-switch-disabled");
        }

        // 触发select事件
        $(dataModel).trigger("select");
    };

    // 切换下一个
    var _switchNext = function(dataModel, list, $obj) {
        var $left = $obj.children("div.sub-switch-left");
        var $right = $obj.children("div.sub-switch-right");
        if ($right.hasClass("sub-switch-disabled")) {
            return;
        }

        var idx = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === dataModel.id) {
                idx = i;
                break;
            }
        }

        var nextModal = list[idx + 1];
        for (var key in nextModal) {
            if (nextModal.hasOwnProperty(key)) {
                dataModel[key] = nextModal[key];
            }
        }

        // 设置dom
        $obj.children("input").val(nextModal.text);

        // 激活左按钮
        $left.removeClass("sub-switch-disabled");

        // 如果是最后一个，则禁用右按钮
        if (idx === list.length - 2) {
            $right.addClass("sub-switch-disabled");
        }

        // 触发select事件
        $(dataModel).trigger("select");
    };

    // 获取数据模型
    var getModel = function($model) {
        return $model[0];
    };

    return {
        initUI: initUI,
        getModel: getModel
    };
})();