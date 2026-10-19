let instructors = [];
let uInstructors, uClasses;
classes = [];

url = 'https://lookinside.ocadu.gd/json/projects';




fetch(url)
  .then(response => response.json())
  .then(data => {
      for (i = 0;i<data.length;i++) {
          
        let inst = data[i].field_instructor.split(", ")
        inst.forEach(element => {
            instructors.push(element)
        });





            // console.log(data[i].field_course_title)
        
            classes.push(data[i].field_course_title)
        

        

          let item = new Project(data[i]);          
          $(item.displayTeaser)
                .appendTo('#container')
                .click(function(){      
                    $('.project-full').remove()          
                    $('body').append(item.displayFull)

                    $('.carousel').flickity({
                        // options
                        pageDots:false,
                        cellAlign: 'left',
                        contain: true,
                        wrapAround:true,
                        arrowShape: { 
                          x0: 10,
                          x1: 60, y1: 50,
                          x2: 80, y2: 30,
                          x3: 50
                        }
                        // prevNextButtons: false
                      });

                      $(".project-full").slideDown()
                })
          
      }

      
      uInstructors = instructors.filter(function(item, pos) {
        return instructors.indexOf(item) == pos;
    })
    
    uClasses = classes.filter(function(item, pos) {        
        return classes.indexOf(item) == pos;
    })
      
    uClasses.sort()

    // for (i=0;i<uInstructors.length;i++) {
    //     b = `<button class='filter-button' data-filter='.${uInstructors[i].replaceAll(' ','_')}'>${uInstructors[i]}</button>`
    //     $("#menu-instructors").append(b)
    // }

    for (i=0;i<uClasses.length;i++) {
      if (uClasses[i] != '') {
        b = `<button class='filter-button' data-filter='.${uClasses[i].replaceAll(' ','_')}'>${uClasses[i]}</button>`
        $("#menu-classes").append(b)
      }
        
    }
  });


  

  $(document).on('click','.project-full, .close',function(e){
    if(e.target !== e.currentTarget) return;

      $('.project-full').slideUp();
      setTimeout(function(){
        $('.project-full').remove();
      },300)
  })



  $(document).on('click','.filter-button',function(e){
      $('.filter-button').removeClass('active')
      $(this).addClass('active')
        f = $(this).data('filter')
    $('.project-teaser').not(f).slideUp()
    $(f).slideDown()
  })
  