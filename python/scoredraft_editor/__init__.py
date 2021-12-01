import os
import sys
import shutil
import time
from importlib.metadata import version 
from subprocess import check_output
import re

if os.name == 'nt':
    os.environ["PATH"] += os.pathsep + "c:/Program Files (x86)/LilyPond/usr/bin"
    
try:
    import ScoreDraft as sd
except:
    pass


def sys_detect():
    info = "<p> Python version: " + sys.version + "</p>\n"    
    
    scoredraft_ver = 'Not Installed'
    try:
         scoredraft_ver = version('scoredraft')
    except:
        pass
    info += "<p> ScoreDraft version: " + scoredraft_ver + "</p>\n"
    
    lilypond_ver = 'Not Installed'    
    try:
        lilypond_out = check_output(['lilypond', '-v']).decode('utf-8')
        m = re.match(r"GNU LilyPond (\d*.\d*.\d*)", lilypond_out)
        if not m is None:
            groups = m.groups()
            lilypond_ver = groups[0]
    except:
        pass   
    
    info += "<p> LilyPond version: " + lilypond_ver + "</p>\n"
    
    try:
        catalog = sd.Catalog
        instruments = catalog['Instruments']
        info += "<div class='column'><h2>Instruments</h2>\n"
        info += "<ul>\n"
        info += "<li>PureSin()</li>\n"
        info += "<li>Square()</li>\n"
        info += "<li>Triangle()</li>\n"
        info += "<li>Sawtooth()</li>\n"
        info += "<li>NaivePiano()</li>\n"
        info += "<li>BottleBlow()</li>\n"
        info += "<li>KarplusStrongInstrument()</li>\n"
        for inst in instruments:
            m = re.match(r"(.*)\s+-\s+(.*)", inst)
            groups = m.groups()
            if groups[1] == "SF2Instrument":
                info += "<li>" + groups[0] + "(i)\n"
                info += "<ul>\n"
                
                path = 'SF2/' + groups[0] + '.sf2'
                sf2 = sd.GetSF2Bank(path)
                num_presets = sf2.num_presets()
                for i in range(num_presets):
                    preset = sf2.get_preset_info(i)
                    info += "<li>" + groups[0] + "("+ str(i) +"): "+ preset['presetName']+"</li>\n"
                info += "</ul>\n"
                info += "</li>\n"                
            else:
                info += "<li>" + groups[0] + "()</li>\n"
        info += "</ul></div>\n"
        
        singers = catalog['Singers']
        info += "<div class='column'><h2>Singers</h2>\n"
        for singer in singers:
            m = re.match(r"(.*)\s+-\s+(.*)", singer)
            groups = m.groups()
            info += "<li>" + groups[0] + "()</li>\n"
        info += "</ul></div>\n"
        
    except:
        pass
    
    with open('sys_detect_templ', 'r') as f_tmpl:
        templ = f_tmpl.read()
        templ = templ.replace('####result####', info)        
        with open("sys_detect.html", 'w') as f_out:
            f_out.write(templ) 

def build_pdf():
    fn_in = sys.argv[1]
    fn = os.path.splitext(fn_in)[0]
    fn_ly = fn + '.ly'

    with open(fn_in, 'r') as f_in:
        score = sd.YAMLScore(f_in)

        with open(fn_ly, 'w') as f_out:
            f_out.write(score.to_ly())

        os.system('lilypond -o ' + fn  +" " + fn_ly)

def build_demo():
    fn_in = sys.argv[1]
    print(fn_in)
    fn = os.path.splitext(fn_in)[0]
    fn_ly = fn + '.ly'
    fn_pdf = fn + '.pdf'
    fn_wav = fn + '.wav'
    fn_html = fn + '.html'

    with open(fn_in, 'r') as f_in:
        score = sd.YAMLScore(f_in)

        with open(fn_ly, 'w') as f_out:
            f_out.write(score.to_ly())

        os.system('lilypond -o ' + fn  +" " + fn_ly)
            
        doc = sd.YAMLDocument(score)
        doc.play()
        doc.mixDown(fn_wav)    
        
        meteor = sd.Meteor(doc.eventList)
        b64 = meteor.to_base64()
        with open('demo_templ', 'r') as f_tmpl:
            templ = f_tmpl.read()
            templ = templ.replace('####b64####', b64)
            templ = templ.replace('####wav####', fn_wav + "?t="+str(time.time()))
            templ = templ.replace('####pdf####', fn_pdf + "?t="+str(time.time()))
            with open(fn_html, 'w') as f_out:
                f_out.write(templ)
                
        dir_name = os.path.dirname(fn_in)
        js_name = dir_name + '/meteor_static.js'
        if not os.path.isfile(js_name):
            shutil.copy("meteor_static.js", dir_name)
