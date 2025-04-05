from flask import Flask, render_template, request, jsonify
import requests
import datetime

app = Flask(__name__)

@app.route('/')
def dashboard():
    return render_template('dashboard.html')

@app.route('/startStimulus', methods=['POST'])
def start_stimulus():
    fully_ip = "localhost"
    fully_port = "2323"
    fully_pass = "pass"
    
    url = f"http://{fully_ip}:{fully_port}/?cmd=loadUrl&url=http://10.0.2.2:5001/test&password={fully_pass}"
    r = requests.get(url)
    
    return jsonify({"status": "sent", "fully_response": r.text})
    
@app.route('/test')
def test_page():
    return app.send_static_file('build/index.html')

results_log = []

@app.route('/submit_result', methods=['POST'])
def submit_result():
    data = request.get_json()
    data['timestamp_human'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    results_log.append(data)
    return {"status": "logged", "data": data}

@app.route('/results', methods=['GET'])
def get_results():
    return jsonify(results_log)

@app.route('/test/<path:path>')
def test_static(path):
    return app.send_static_file(f'build/{path}')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)