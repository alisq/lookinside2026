class Project {
    constructor(content) {
        
        this.title = content.title;
        this.teaser_image = content.field_project_images_1;
        this.project_images = content.field_project_images.split(', ');
        this.desc = content.body;
        this.student = content.field_student_name;
        this.instructor = content.field_instructor;
        this.instructor_machine = content.field_instructor.replaceAll(' ','_').replaceAll(',_',' ');
        this.year = content.field_project_year;
        
         
        this.course = content.field_course_title;
        this.course_machine = content.field_course_title.replaceAll(' ','_').replaceAll(',_',' ');

        this.faculty_video = content.field_youtube_url.replace("https://www.youtube.com/watch?v=","");
        
 

        this.external_link = content.field_external_link;

        
        
         (this.faculty_video !== '') ? this.faculty_video_tag = 'faculty_vid' : this.faculty_video_tag = '';
            
        

        


        

        //CODE FOR PARSING VIDEO
            let v = ""
            if (content.field_project_.includes('vimeo')){
                v = `<div class='image'><style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://player.vimeo.com/video/${vimeo_parser(content.field_project_)}' frameborder='0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe></div></div>`
            } else if (content.field_project_.includes('youtu')) {
        
                v = `<div class='image'><style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/${youtube_parser(content.field_project_)}' frameborder='0' allowfullscreen></iframe></div></div>`
            } else {
                v = '';
            }
        this.video = v;
            
        
        
        
        
    }

    get displayTeaser() {
        /* html */
        let teaser = `
            <div class='project-teaser ${this.instructor_machine} ${this.course_machine} ${this.faculty_video_tag}' data-id='${i}'>   
                <img src='http://lookinside.ocadu.gd/${this.teaser_image}' />
                <h2>${this.title}</h2>
                
            </div>
        `;
        return teaser;
    }

    get displayFull() {




        /* html */
        let full = `
            <div class='project-full ${this.instructor_machine} ${this.course_machine}' data-id='${i}'>   
            <button class='close'>&times;</button>    
            <div class="interior">
            
                
                <div class='gallery ${(this.project_images.length > 1) || (this.video != '') ? 'carousel' : null}' >
                    ${this.video}

                    
                ${(this.external_link == '') ?  this.project_images.map(pi => `<div class='image'><img src='http://lookinside.ocadu.gd/${pi}' /></div>`).join("") : this.project_images.map(pi => `<div class='image'><a href='${this.external_link}' target='_blank'><img src='http://lookinside.ocadu.gd/${pi}' /></a></div>`).join("")}
                
                    
                
                </div>
                
                <div class='project-details'>
                <h2>${this.title}</h2>
                <h3>${this.student}</h3>
                <div>${this.desc}</div>
                <div>
                <div class='instructor'><label>Instructor:</label> ${this.instructor}</div>
                <div class='class'><label>Course:</label> ${this.course}</div>
                <div class='year'><label>Year:</label> ${this.year}</div>



                </div>
                </div>
                </div>
            </div>

        `

    if (this.faculty_video !== "") {
        /* html */
        full = `
             <div class='project-full ${this.instructor_machine} ${this.course_machine}' data-id='${i}'>   
            <button class='close'>&times;</button>    
            <div class="interior">
            <div class='image'><style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/${(this.faculty_video)}?autoplay=1' frameborder='0' allowfullscreen autoplay></iframe></div></div>
                
                <div class='gallery' >
                    ${this.video}
                
                </div>
                
                <div class='project-details'>
                    <h2>${this.title}</h2>
                <div>
                


                </div>
            </div>
        `
    }

        return full;
    }
}




function youtube_parser(url){
    

    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    
    
    return match[7]
    
}

function vimeo_parser(url) {
    var split = url.split('/')[3]
    return split

}