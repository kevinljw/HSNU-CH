var startTimer, endTimer;

//////////////////////////
	    //  Handlebars helpers  //
	    //////////////////////////	
		
			// conditional helper
			Handlebars.registerHelper("cond", function(lvalue, operator, rvalue, options) {
				if (arguments.length < 4) {
		        // Operator omitted, assuming "+"
		        options = rvalue;
		        rvalue = operator;
		        operator = "+";
		    }

		    lvalue = parseFloat(lvalue);
		    rvalue = parseFloat(rvalue);

		    return {
		        "+": lvalue + rvalue,
		        "-": lvalue - rvalue,
		        "*": lvalue * rvalue,
		        "/": lvalue / rvalue,
		        "%": lvalue % rvalue,
						">": lvalue > rvalue,
					 ">=": lvalue >= rvalue,
						"<": lvalue < rvalue,
					 "<=": lvalue <= rvalue,
					"===": lvalue === rvalue,
					 "==": lvalue == rvalue,
		    }[operator];
			});
			
			// if condition helper
			Handlebars.registerHelper('ifCond', function (left, operator, right, options) {
			    switch (operator) {
			        case '==':
			            return (left == right) ? options.fn(this) : options.inverse(this);
			            break;
			        case '===':
			            return (left === right) ? options.fn(this) : options.inverse(this);
			            break;
			        case '<':
			            return (left < right) ? options.fn(this) : options.inverse(this);
			            break;
			        case '<=':
			            return (left <= right) ? options.fn(this) : options.inverse(this);
			            break;
			        case '>':
			            return (left > right) ? options.fn(this) : options.inverse(this);
			            break;
			        case '>=':
			            return (left >= right) ? options.fn(this) : options.inverse(this);
			            break;
			        default:
			            return options.inverse(this)
			            break;
			    }
			    //return options.inverse(this);
			});
			
		
    /////////////////
    //  variables  //
    /////////////////
		
		var allQuestions = (function() {
			var json;
			$.ajax({
				'async': false,
				'global': false,
				'url': "js/level-questions.json",
				'dataType': "json",
				'success': function(data){
					json = data;
//                    console.log(json);		
				}
			}); 
            
			return json;
		})();
	
    var levelCount = 0,qCount = 0, points = 0, l = allQuestions.level.length, correct = [];


    
    /////////////////
    //  functions  //
    /////////////////


		// set up function for beginning of page and page reset		
    var set = function() {
        // display settings set up for javascript disabled users
        $('header').css({'display':'block'});
        $('#main').css({'display':'block'});
        $('#noscript').css({'display':'none'});
        // hide all elements other than #INTRO and .QUESTION
        $('.content').not($('#intro')).hide();
        $('.level').children().hide();
        $('#intro, .question, .level').show();
        $('.alert_error').hide();
        $('.alert_blank').hide();
        // reset variables to starting values
        qCount = 0;
        points = 0;
        levelCount = 0;
        correct = Array(l).fill(0);
      
				// reset previously answered questions
				$('.active').removeClass('active');
    };
		
		//////////////////////////////////
		//  old code before handlebars.js  //
		////////////////////////////////// 		
    // 
		// set up capitalization on strings
    // String.prototype.capitalize = function() {
    //         return this.charAt(0).toUpperCase() + this.slice(1);
    //     };
    // 
    // var questions = function() {
    //     // clear all, if any, questions within .QUESTION
    //     $('.question').html('');
    //     // create each question form and append to .QUESTION
    //     $.each(allQuestions, function(i){
    //         // create html for individual questions and choices
    //         var html = "<form id = question_" + (i+1) + "><p>" + allQuestions[i].question + "</p>";
    //         // loop through and create radio buttons for each choice
    //         for(var x = 0 ; x < allQuestions[i].choices.length; x++){
    //             html += "<input class='choice' id='choice" + (i+1) + "_" + (x+1) + "' type='radio' name='radio" + (i+1) + "' class='radio' value='" + allQuestions[i].choices[x] + "' >";
    //             html += "<label for='choice" + (i+1) + "_" + (x+1) + "'>" + allQuestions[i].choices[x].capitalize() + "</label><br>";
    //         }
    //         //make a previous button only if there is a question to go back to
    //         if (i > 0) {html += "<div class='previous'>Previous</div><br>";}
    //         html += "<div class='next'>Next</div></form>";
    //         // insert html for next individual question
    //         $('.question').append(html);
    //     });
    // };

    var answer = function(i) {
        
        var checked = $('#level_'+ (i) + ' .active');
        var question_num = $('#level_'+ (i) + ' .question>.panel').length;
        // client side validation: make sure a choice is checked before moving to next question
//        console.log(checked.length, question_num);
//        console.log(checked);
        if(checked.length === question_num){
            
            // submit a 1 or 0 into the CORRECT array if answer is correct
            correct[i-1]=0;
           for(var index=0; index<question_num; index++){
               
               var this_panel =  $('#level_'+ (i) + ' #question_'+(index+1)).closest(".panel-heading").parent(".panel");
               
               if (checked[index].value.toLowerCase() === allQuestions.level[i-1].questions[index].correctAnswer.toLowerCase() ){
                    correct[i-1]++;
                   
                   this_panel.removeClass("panel-default");
                   this_panel.removeClass("panel-danger");
                   this_panel.addClass("panel-success");
                   
                }
               else{
                
                   
                  this_panel.addClass("panel-danger");
                   this_panel.removeClass("panel-default");
                   this_panel.removeClass("panel-success");
                   
               }
               
//               console.log(checked[index].value.toLowerCase(), allQuestions.level[i-1].questions[index].correctAnswer.toLowerCase(), correct[i-1]);
            };
            
            console.log("correct:"+correct[i-1]);
            if(correct[i-1]>=question_num){
                
                return true;
            }
            else{
                var nextButton = $('#level_' + levelCount + ' .next');
                if (nextButton.hasClass('btn-success')){
                    nextButton.removeClass('btn-success').addClass('btn-danger');
                }
//                alert("答案有錯，請再檢查");
                $('.alert_error').show();
                return false;
            }
            
            
        } else {
//            alert("還沒作答完畢呢");
            $('.alert_blank').show();
            return false;
        }
    };

		

    var total = function() {
        // add all the elements within CORRECT array
        $.each(correct,function() {
            points += this;
        });
        // get percentage of correct answers divided by total questions
        points = (points/l)*100;
        return points.toFixed(2);
    };

    // fade out #INTRO and fade in first question
    var begin = function(i) {
        $('#intro').fadeOut('slow',function(){
            $(this).next().children().first().fadeIn();
        });
        levelCount += 1;
    };

    // fade out current question and fade in next question
    var forward = function(i) {
        $('#level_' + i).fadeOut(function(){
            $(this).next().fadeIn();
            $('.alert_error').hide();
            $('.alert_blank').hide();
        });
        
        levelCount += 1;
    };

    // fade out current question and fade in previous question
    var backward = function(i){
        $('#level_' + i).fadeOut(function(){
            $(this).prev().fadeIn();
        });
        levelCount -= 1;
    };

    // fade out last question and display score results within #score div
    var end = function(i) {
        endTimer = new Date();
        // get total seconds between the times
        var delta = Math.abs(endTimer - startTimer)/ 1000;
        
        // calculate (and subtract) whole minutes
        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        // what's left is seconds
        var seconds = Math.floor(delta % 60);  // in theory the modulus is not required
        
        
//        console.log("diff: "+diff);
        
        $('#level_' + i).fadeOut(function(){
            
            var resultsColor = $('p#final');
            
            $('.content').not($('#score')).hide();
            seconds
            $('#final').empty().append(minutes + ' 分 '+ seconds+" 秒");
//            $('#final').empty().append(total() + '%');
//            
//            if(points < 40){
//                    resultsColor.css('color','red');
//            } else if (points <= 70){
//                    resultsColor.css('color','rgb(231, 231, 85)');
//            } else if (points > 70){
//                    resultsColor.css('color','green');
//            }
            $('#score').fadeIn();
        });
        
        var these_panel =  $('.panel-group.question .panel');
               

       these_panel.removeClass("panel-success");
       these_panel.removeClass("panel-danger");
       these_panel.addClass("panel-default");
    };

    var next = function(i) {
				var nextButton = $('#level_' + (i+1) + ' .next');
        
        // if no question is displayed, display the first question
        if(i === 0) {
                begin(i);
             nextButton.removeClass('btn-success').addClass('btn-danger');
        // as long as a choice is selected
        } else {
            if (answer(i) !== false){
                // if no more questions remain, show results
                if(i === (l)){
                    
                    end(i);
                // if more questions remain, show next question
                } else {
                    
                    forward(i);
                }
        	} else {
                // change next button to red button if answer hasn't been selected
//                alert("還沒作答完畢呢");
                nextButton.removeClass('btn-success').addClass('btn-danger');
            }
       }
    };


    ////////////
    //  main  //
    ////////////

$(function(){
    
		// change the next button to the correct green
		$('.level').on("click",".choice", function(){
//            console.log($(this).id);
            $(this).siblings().removeClass("active");
            $(this).siblings().removeClass("answered");
            $(this).addClass("answered");
//            console.log(levelCount);
           $('.alert_error').fadeOut();
            $('.alert_blank').fadeOut();

            
            var checked = $('#level_'+ (levelCount) + ' .answered');
            var question_num = $('#level_'+ (levelCount) + ' .question>.panel').length;
          
            if(checked.length === question_num){
                
                var nextButton = $('#level_' + levelCount + ' .next');
                if (nextButton.hasClass('btn-danger')){
                    nextButton.removeClass('btn-danger').addClass('btn-success');
                }
            }
            
           var thisPanel =$(this).parent("#choices").parent(".panel-collapse").parent(".panel");
            
            if(!$(this).hasClass("active")){
                 $(this).parent("#choices").parent(".panel-collapse").collapse('hide');
                
                
                thisPanel.removeClass("panel-default");
                thisPanel.removeClass("panel-danger");
                thisPanel.addClass("panel-success");
            }
            else{
               
                thisPanel.removeClass("panel-success");
                thisPanel.removeClass("panel-danger");
                thisPanel.addClass("panel-default");
            }
             
            
           
            
		});
        
    
       
    $('.start').click(function(){
        startTimer = new Date();
        next(levelCount);
    });
    $('#retry').click(function(){
        set();
				$('.start').trigger("click");
    });
		
    // .on() is used for dynamically created links that were created after the document and scripts loaded
//    $('.question').on("click",".next",function() {
//        next(levelCount);
//        answer(levelCount);
//    });
    $('.level').on("click",".next",function() {
//        console.log(levelCount);
        
        next(levelCount);
//        answer(levelCount);
    });
    
//    $('.question').on("click",".previous",function() {
//        backward(levelCount);
//        answer(levelCount);
//    });
    $('.level').on("click",".previous",function() {
         backward(levelCount);
//         answer(levelCount);
    });
		// Get the HTML from the template  in the script tag
    var source = $("#questionHB").html();
    var source2 = $("#welcomeHB").html();
    var source3 = $("#introHB").html();
    var source4 = $("#endingHB").html();
    // Compile the template
    var template = Handlebars.compile(source);
    var template2 = Handlebars.compile(source2);
    var template3 = Handlebars.compile(source3);
    var template4 = Handlebars.compile(source4);
    // append compiled template to the end of .QUESTION
    $(".level").append(template(allQuestions)); 
    $("header.page-header").append(template2(allQuestions)); 
    $("#intro").prepend(template3(allQuestions)); 
    $("#score").prepend(template4(allQuestions)); 

		set();
    
    $('.panel-heading').click(
            function() {
//            console.log("hover");
             $(this).siblings(".panel-collapse").collapse("toggle");
          }
    );
//    $(".panel-group.question .panel").hover(function(){
//        
//        var a_href = $(this).find("a").attr('href');
//        console.log(a_href);
//        location.hash = a_href;
//    });

    // flash a highlight on the correct answer if user presses "c" on keyboard
//    $(document).keypress(function(e) {
//        // if letter "c" is pressed
//        if(e.which === 99) {
//            // loop through each question
//            $.each(allQuestions.questions, function(i){
//                // loop through each choice within current question
//                $.each(allQuestions.questions[i].choices, function(x){
//                    // if current choice within current question is equal to current questions correctAnswer value
//                    if(allQuestions.questions[i].choices[x].choice.toLowerCase() === allQuestions.questions[i].correctAnswer.toLowerCase()){
//                        // select that specific choices <label> element and store in variable
//                        var correct = $("#question_" + (i+1) + " #choice_" + (x+1));
//												if (correct.hasClass('active')) {
//													correct.removeClass('active');
//												}
//                        // get current background-color
//                        // clear any previous button presses and animate the background with a flash of yellow
//                        correct.focus();
//                    }
//                });
//            });
//        }
//    });
//
//		// use the right arrow key to click the next button
//		$(document).keydown(function(e) {
//			if(e.keyCode === 39) {
//				$.each(allQuestions.questions, function(i) {
//					if ($('#question_' + (i+1)).is(':visible')) {
//					    	$('#question_' + (i+1) + ' .next').trigger("click");
//					}					
//				})
//			}
//		})
//		
//		// use the left arrow key to click the previous button
//		$(document).keydown(function(e) {
//			if(e.keyCode === 37) {
//				$.each(allQuestions.questions, function(i) {
//					if ($('#question_' + (i+1)).is(':visible')) {
//					    	$('#question_' + (i+1) + ' .previous').trigger("click");
//					}					
//				})
//			}
//		})

});