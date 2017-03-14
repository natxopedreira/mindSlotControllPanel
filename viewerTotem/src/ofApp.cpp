#include "ofApp.h"

//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
void removeCharsFromString( string &str, char* charsToRemove ) {
   for ( unsigned int i = 0; i < strlen(charsToRemove); ++i ) {
      str.erase( remove(str.begin(), str.end(), charsToRemove[i]), str.end() );
   }
}
//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
// a boolean function that tells ofSort how to compare two items
bool sortMe(elemento & a, elemento & b){
    // convertimos el string a numero

    removeCharsFromString( a.tiempo, ":" );
    removeCharsFromString( b.tiempo, ":" );

    int fecha_A = ofToInt(a.tiempo);
    int fecha_B = ofToInt(b.tiempo);


    if (fecha_A < fecha_B){
        return true;
    } else {
        return false;
    }
}


//--------------------------------------------------------------
void ofApp::setup(){

   //callNodeServer();

    // consultamos al server cada 10 segundos
    tiempoServer.setup(5000);
    tiempoServer.start(false);

    ofAddListener( tiempoServer.TIMER_COMPLETE , this, &ofApp::tiempoServerCompleteHandler ) ;

    fondo.load("fondo_mindRace.png");
    barra.load("banda_mindRace.png");
    mascara.load("mask.png");


    fuenteSkin.loadFont("ubuntu-font/UbuntuMono-R.ttf",36);
    fuenteSkinTiempos.loadFont("ubuntu-font/Ubuntu-LI.ttf",42);
    fuenteSkinPosicion.loadFont("ubuntu-font/UbuntuMono-BI.ttf",47);

    fuenteSkinNombre.loadFont("ubuntu-font/Ubuntu-MI.ttf",24);



}

//--------------------------------------------------------------
void ofApp::update(){
    tiempoServer.update();
}

//--------------------------------------------------------------
void ofApp::draw(){

    fondo.draw(0,0);

    // dibujamos
    int inicialY = 50;

    for(int f = elementos.size()-1; f>=0; f--){
         barra.draw((60) + 125*f,0);
    }


    for(int i = 0; i < elementos.size(); i++){
        elementos.at(i).thumb.getTexture().setAlphaMask(mascara.getTexture());

        ofPushMatrix();
            ofPushStyle();

                ofTranslate((335) + (125*i),570);
                ofRotate(270);

                ofSetColor(1,9,107);
                fuenteSkinTiempos.drawString(elementos.at(i).tiempoFormat, 0,0);
                fuenteSkinNombre.drawString(elementos.at(i).nombre, -215,0);

                ofSetColor(219,88,0);
                fuenteSkinPosicion.drawString("O"+ofToString(i+1),-495,-3);

                ofSetColor(255,255,255);
                elementos.at(i).thumb.draw(-402,-94);

            ofPopStyle();
        ofPopMatrix();
    }





}


//--------------------------------------------------------------
void ofApp::tiempoServerCompleteHandler( int &args )
{
    callNodeServer();
    tiempoServer.start(false);
}

//--------------------------------------------------------------
void ofApp::callNodeServer(){

    // Now parse the JSON
    bool serverCall = json.open("http://localhost:8081/get/jsonOF");

    // comprueba si hay alguno que falte, si lo hay borra el vector-carga-reordena
    if(!serverCall) return;

    bool recarga = false;
    elementos.clear();

    for (Json::ArrayIndex i = 0; i < json.size(); ++i)
    {


        std::vector<elemento>::iterator it = std::find(elementos.begin(), elementos.end(), elemento(json[i]["idplayer"].asInt(), "","","") );

        if(it != elementos.end()){
            //std::cout << "HAY" << std::endl;
        }else{
            // no esta en el vector asi que lo metemos
            elemento el(json[i]["idplayer"].asInt(),
                        json[i]["nombre"].asString(),
                        "/home/natxo/mindSlotControllPanel/public/uploads/thumbs/"+json[i]["foto"].asString(),
                        json[i]["tiempo"].asString());



            elementos.push_back(el);

            recarga = true;
        }

    }

    if(recarga){
        // reordenamos el vector
        ofSort(elementos, sortMe);
    }

}
