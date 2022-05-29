var $testRemind = function(target, content, center) {
    if ($isEle(target) && content) {
        $powerFloat(target, {
            eventType:null,
            targetMode:"remind",
            target:content,
            zIndex:201,
            position:center ? "5-7" :"1-4"
        });
    }
};

$testRemind.extend({
    hide:function() {
        if ($("floatBox_remind")) {
            $("floatBox_remind").out();
            $$(".float_corner").dispose();
        }
    },
    bind:function() {
        if (!document.retrieve("testRemind")) {
            document.addEvent("mousedown", function() {
                $testRemind.hide();
            }).store("testRemind", true);
        }
    }
});