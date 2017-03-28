#include "ofMain.h"
#include "ofApp.h"

class ofApp2: public ofBaseApp
{
public:
    ofImage img;

    void setup(){
        ofHideCursor();
        img.load("ABANCA-PANTALLA-superior.png");
    }

    void draw(){
        img.draw(0,0);
        //ofDrawBitmapString("window 2",ofGetWidth()/2,ofGetHeight()/2);
    }

    void keyPressed(int key){
    }
};
//========================================================================
int main( ){
    /*
    ofSetupOpenGL(1920,1080,OF_WINDOW);			// <-------- setup the GL context

    // this kicks off the running of my app
    // can be OF_WINDOW or OF_FULLSCREEN
    // pass in width and height too:
    ofRunApp(new ofApp());
    */

    ofGLWindowSettings settings;
    settings.setPosition({0.f,0.f});
    //settings.width = 1920;
    //settings.height= 1080;
    //

    settings.windowMode = OF_FULLSCREEN;
    auto win1 = ofCreateWindow(settings);

    settings.setPosition({0.0f,1080.0f});
    settings.windowMode = OF_FULLSCREEN;
    auto win2 = ofCreateWindow(settings);

    ofRunApp(win2, std::make_shared<ofApp>());
    ofRunApp(win1, std::make_shared<ofApp2>());

    ofRunMainLoop();


}
