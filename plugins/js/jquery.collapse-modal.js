;(function(window,document){
    let $ = window.$;

    $.fn.collapse = function(){        
        this.each(function(){
            let sections = $(this).find('[data-toggle="collapse"]');
            sections.on('click',function(e){
                if($(this).attr('aria-controls')){
                    e.preventDefault();
                    let contentId = $(this).attr('href');
                    console.log(contentId);
                    $(contentId).toggleClass('collapse');
                }
            })
        })
    }

    $.fn.modal = function(){
        return this.each(function(){
            let _this  = this;
            $(this).css({
                display : 'block',
                opacity : 1
            }).on('click',function(){
                $(this).css({
                    opacity : '',
                    display: ''
                });
            }).children('.modal-dialog').on('click',function(e){
                e.stopPropagation();
            });

            $(this).find('.close').on('click',function(){
                $(_this).css({
                    opacity : '',
                    display: ''
                });
            })
            $(this).find('.modal-footer > .btn-secondary').on('click',function(){
                $(_this).css({
                    opacity : '',
                    display: ''
                });
            });
        });
    }
})(window,document);
