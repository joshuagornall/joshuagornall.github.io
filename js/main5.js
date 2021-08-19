(function() {
  
    window.CanvasSlideshow = function( options ) {

      

      //  SCOPE
      /// ---------------------------      
      var that  =   this;


      
      //  OPTIONS
      /// ---------------------------      
      options                     = options || {};
      options.stageWidth          = options.hasOwnProperty('stageWidth') ? options.stageWidth : 1200;
      options.stageHeight         = options.hasOwnProperty('stageHeight') ? options.stageHeight : 1200;
      options.pixiSprites         = options.hasOwnProperty('sprites') ? options.sprites : [];
      options.centerSprites       = options.hasOwnProperty('centerSprites') ? options.centerSprites : false;
      options.texts               = options.hasOwnProperty('texts') ? options.texts : [];
      options.autoPlay            = true;
      options.autoPlaySpeed       = [4, 3];
      options.fullScreen          = false;
      options.displaceScale       = [5000, 10000];
      options.displacementImage   = options.hasOwnProperty('displacementImage') ? options.displacementImage : '';
      options.navElement          = options.hasOwnProperty('navElement')  ?  options.navElement : document.querySelectorAll( '.scene-nav' ); 
      options.displaceAutoFit     = false;
      options.wacky               = options.hasOwnProperty('wacky') ? options.wacky : false;
      options.interactive         = true;
      options.interactionEvent    = 'hover';
      options.displaceScaleTo     = ( options.autoPlay === false ) ? [ 0, 0 ] : [ 20, 20 ];
      options.textColor           = options.hasOwnProperty('textColor') ? options.textColor : '#fff';
      options.displacementCenter  = options.hasOwnProperty('displacementCenter') ? options.displacementCenter : false;
      options.dispatchPointerOver = true;
      


      //  PIXI VARIABLES
      /// ---------------------------    
      var renderer            = new PIXI.autoDetectRenderer( options.stageWidth, options.stageHeight, { transparent: true });
      var stage               = new PIXI.Container();
      var slidesContainer     = new PIXI.Container();
      var displacementSprite  = new PIXI.Sprite.fromImage( options.displacementImage );
      var displacementFilter  = new PIXI.filters.DisplacementFilter( displacementSprite );



      //  TEXTS
      /// ---------------------------
      var style = new PIXI.TextStyle({});

      

      //  SLIDES ARRAY INDEX
      /// ---------------------------    
      this.currentIndex = 0;



      /// ---------------------------
      //  INITIALISE PIXI
      /// ---------------------------      
      this.initPixi = function() {

        // Add canvas to the HTML
        document.getElementsByClassName(options.location)[0].appendChild( renderer.view );
  

        // Add child container to the main container 
        stage.addChild( slidesContainer );
  

        // Enable Interactions
        stage.interactive = true;
        
  
        // Fit renderer to the screen
        if ( options.fullScreen === true ) {
          renderer.view.style.objectFit = 'cover';
          renderer.view.style.width     = '100%';
          renderer.view.style.height    = '100%';
          renderer.view.style.top       = '50%';
          renderer.view.style.left      = '50%';
          renderer.view.style.webkitTransform = 'translate( -50%, -50% ) scale(1.2)';
          renderer.view.style.transform = 'translate( -50%, -50% ) scale(1.2)';           
        } else {
          renderer.view.style.maxWidth     = '100%';
        }
        
  
        displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;


        // Set the filter to stage and set some default values for the animation
        stage.filters = [displacementFilter];        

        if ( options.autoPlay === false ) {
          displacementFilter.scale.x = 0;
          displacementFilter.scale.y = 0;
        }

        if ( options.wacky === true ) {

          displacementSprite.anchor.set(0.5);
          displacementSprite.x = renderer.width / 2;
          displacementSprite.y = renderer.height / 2;
        }

        displacementSprite.scale.x = 2;
        displacementSprite.scale.y = 2;
  
        // PIXI tries to fit the filter bounding box to the renderer so we optionally bypass
        displacementFilter.autoFit = options.displaceAutoFit;
        
        stage.addChild( displacementSprite );

      };



      /// ---------------------------
      //  LOAD SLIDES TO CANVAS
      /// ---------------------------          
      this.loadPixiSprites = function( sprites ) {
        

        var rSprites = options.sprites;
        var rTexts   = options.texts;

        for ( var i = 0; i < rSprites.length; i++ ) {
          
          var texture   = new PIXI.Texture.fromImage( sprites[i] );
          var image     = new PIXI.Sprite( texture );

          if ( rTexts ) {
            var richText = new PIXI.Text( rTexts[i], style);
            image.addChild(richText);

            richText.anchor.set(0.5);
            richText.x = image.width / 2;
            richText.y = image.height / 2;                     
          }
          
          if ( options.centerSprites === true ) {
            image.anchor.set(0.5);
            image.x = renderer.width / 2;
            image.y = renderer.height / 2;            
          }
          // image.transform.scale.x = 1.3;
          // image.transform.scale.y = 1.3;
         

          
          if ( i !== 0  ) {
            TweenMax.set( image, { alpha: 0 } );
          }

          slidesContainer.addChild( image );

        } 
        
      };
      


      /// ---------------------------
      //  DEFAULT RENDER/ANIMATION
      /// ---------------------------        
      if ( options.autoPlay === true ) {

        var ticker = new PIXI.ticker.Ticker();

        ticker.autoStart = options.autoPlay;

        ticker.add(function( delta ) {
          
          displacementSprite.x += options.autoPlaySpeed[0] * delta;
          displacementSprite.y += options.autoPlaySpeed[1];
          
          renderer.render( stage );

        });

      }

      


      /// ---------------------------
      //  INIT FUNCTIONS
      /// ---------------------------    

      this.init = function() {

        
        that.initPixi();
        that.loadPixiSprites( options.pixiSprites );
        

      };



      
      /// ---------------------------
      //  INTERACTIONS
      /// ---------------------------
      function rotateSpite() {
        displacementSprite.rotation += 0.001;
        rafID = requestAnimationFrame( rotateSpite );
      }
            
      if ( options.interactive === true ) {
        
        var rafID, mouseX, mouseY;

        // Enable interactions on our slider
        slidesContainer.interactive = true;
        slidesContainer.buttonMode  = true;       

        // HOVER
        if ( options.interactionEvent === 'hover' || options.interactionEvent === 'both'  )  {
            
          slidesContainer.pointerover = function( mouseData ){
            mouseX = mouseData.data.global.x;
            mouseY = mouseData.data.global.y;
            TweenMax.to( displacementFilter.scale, 1, { x: 0, y: 0 });
            rotateSpite();
          };

          slidesContainer.pointerout = function( mouseData ){
            TweenMax.to( displacementFilter.scale, 1, { x: "+=" + Math.sin( mouseX ) * 100 + "", y: "+=" + Math.cos( mouseY ) * 100 + ""  });
            cancelAnimationFrame( rafID );
          };
        }
      
      }
      
      
      /// ---------------------------
      //  CENTER DISPLACEMENT
      /// ---------------------------
      if ( options.displacementCenter === true ) {
        displacementSprite.anchor.set(0.5);
        displacementSprite.x = renderer.view.width / 2;
        displacementSprite.y = renderer.view.height / 2;        
      }
      
      
      /// ---------------------------
      //  START 
      /// ---------------------------           
      this.init();

      
      /// ---------------------------
      //  HELPER FUNCTIONS
      /// ---------------------------
      function scaleToWindow( canvas, backgroundColor ) {
        var scaleX, scaleY, scale, center;
      
        //1. Scale the canvas to the correct size
        //Figure out the scale amount on each axis
        scaleX = window.innerWidth / canvas.offsetWidth;
        scaleY = window.innerHeight / canvas.offsetHeight;
      
        //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
        scale = Math.min(scaleX, scaleY);
        canvas.style.transformOrigin = "0 0";
        canvas.style.transform = "scale(" + scale + ")";
      
        //2. Center the canvas.
        //Decide whether to center the canvas vertically or horizontally.
        //Wide canvases should be centered vertically, and 
        //square or tall canvases should be centered horizontally
        if (canvas.offsetWidth > canvas.offsetHeight) {
          if (canvas.offsetWidth * scale < window.innerWidth) {
            center = "horizontally";
          } else {
            center = "vertically";
          }
        } else {
          if (canvas.offsetHeight * scale < window.innerHeight) {
            center = "vertically";
          } else {
            center = "horizontally";
          }
        }
      
        //Center horizontally (for square or tall canvases)
        var margin;
        if (center === "horizontally") {
          margin = (window.innerWidth - canvas.offsetWidth * scale) / 2;
          canvas.style.marginTop = 0 + "px";
          canvas.style.marginBottom = 0 + "px";
          canvas.style.marginLeft = margin + "px";
          canvas.style.marginRight = margin + "px";
        }
      
        //Center vertically (for wide canvases) 
        if (center === "vertically") {
          margin = (window.innerHeight - canvas.offsetHeight * scale) / 2;
          canvas.style.marginTop = margin + "px";
          canvas.style.marginBottom = margin + "px";
          canvas.style.marginLeft = 0 + "px";
          canvas.style.marginRight = 0 + "px";
        }
      
        //3. Remove any padding from the canvas  and body and set the canvas
        //display style to "block"
        canvas.style.paddingLeft = 0 + "px";
        canvas.style.paddingRight = 0 + "px";
        canvas.style.paddingTop = 0 + "px";
        canvas.style.paddingBottom = 0 + "px";
        canvas.style.display = "block";

        return scale;
      }

      
    };

  })(); 
