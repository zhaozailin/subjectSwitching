/**
 * Created by zhaozl on 2016-07-19.
 */
var subjectSwitching = (function() {

    // 初始化UI
    var initUI = function($obj, list) {

        // 存储数据状态的对象
        var dataModel = {
            id: "",
            code: ""
        };

        // 初始化数据模型、UI状态
        _initDataUI(dataModel, list, $obj);

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
                dataModel.id = ui.item.id;
                dataModel.code = ui.item.code;
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
        });

        return dataModel;
    };

    // 初始化数据模型、UI状态
    var _initDataUI = function(dataModel, list, $obj) {
        var $input = $obj.children("input");

        if (list.length > 0) {
            dataModel.id = list[0].id;
            dataModel.code = list[0].code;
            $input.val(list[0].text);
        }

        // 没有数据时，禁用右按钮
        else {
            $obj.children("div.sub-switch-right").addClass("sub-switch-disabled");
        }
    };

    // 通过关键字过滤
    var _filter = function(key, list) {
        var newList = [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].text.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
                newList.push({id: list[i].id, code: list[i].code, value: list[i].text});
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
        dataModel.id = nextModal.id;
        dataModel.code = nextModal.code;

        // 设置dom
        $obj.children("input").val(nextModal.text);

        // 激活右按钮
        $right.removeClass("sub-switch-disabled");

        // 如果是第一个，则禁用左按钮
        if (idx === 1) {
            $left.addClass("sub-switch-disabled");
        }
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
        dataModel.id = nextModal.id;
        dataModel.code = nextModal.code;

        // 设置dom
        $obj.children("input").val(nextModal.text);

        // 激活左按钮
        $left.removeClass("sub-switch-disabled");

        // 如果是最后一个，则禁用右按钮
        if (idx === list.length - 2) {
            $right.addClass("sub-switch-disabled");
        }
    };

    return {
        initUI: initUI
    };
})();