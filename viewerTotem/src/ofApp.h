#pragma once

#include "ofMain.h"
#include "ofxJSON.h"
#include "ofxSimpleTimer.h"

class elemento
{
public:
    int idPlayer;
    string nombre;
    string fotoUrl;
    string tiempo;
    string tiempoFormat;
    ofImage thumb;

    elemento(int _idPlayer,
             string _nombre,
             string _fotoUrl,
             string _tiempo) {
        idPlayer = _idPlayer;
        nombre = _nombre;
        fotoUrl = _fotoUrl;
        tiempo = _tiempo;
        tiempoFormat = _tiempo;


        thumb.loadImage(_fotoUrl);
    }

    bool operator== ( const elemento &el1)
    {
        if(idPlayer == el1.idPlayer){
            return true;
        }else{
            return false;
        }
    }

};

class ofApp : public ofBaseApp{

public:
    void setup();
    void update();
    void draw();

    vector<elemento> elementos;

    void callNodeServer();
    void tiempoServerCompleteHandler(int &args);

    ofxJSONElement json;
    ofxSimpleTimer tiempoServer;
    ofTrueTypeFont fuenteSkin,fuenteSkinTiempos,fuenteSkinPosicion, fuenteSkinNombre;

    ofImage fondo, barra, mascara;
};
