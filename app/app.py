from flask import Flask, request, send_file
from flask_cors import CORS
import pikepdf
import io

app = Flask(__name__)
CORS(app) # This allows your Google Apps Script HTML to talk to this server

@app.route('/unlock', methods=['POST'])
def unlock_pdf():
    if 'file' not in request.files or 'password' not in request.form:
        return {"error": "Missing file or password"}, 400
    
    file = request.files['file']
    password = request.form['password']
    
    try:
        # pikepdf easily cuts through AES Bank Encryption
        pdf = pikepdf.open(file, password=password)
        
        output = io.BytesIO()
        pdf.save(output)
        output.seek(0)
        
        return send_file(output, mimetype='application/pdf', as_attachment=True, download_name='unlocked.pdf')
        
    except pikepdf.PasswordError:
        return {"error": "Incorrect password"}, 401
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
