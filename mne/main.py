import flask
from flask_restful import reqparse, Api, Resource, inputs
import werkzeug
from process_eeg import process_eeg
from pathlib import Path
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)
api = Api(app)

class Upload(Resource):
    def __init__(self):
        self.parser = reqparse.RequestParser()
    def post(self):
        self.parser.add_argument("eeg_file", type=werkzeug.datastructures.FileStorage, location="files")
        parse_args = self.parser.parse_args()
        eeg_file = parse_args.get("eeg_file")
        duration = flask.request.form.get("duration")
        path = Path(UPLOAD_DIR + eeg_file.filename)
        eeg_file.save(path)
        if(duration != None):
            to_be_returned = process_eeg(path, duration)
        else:
            to_be_returned = process_eeg(path)
        path.unlink(missing_ok=True)
<<<<<<< HEAD
        to_be_returned = flask.jsonify(to_be_returned)
        to_be_returned.headers.add("Access-Control-Allow-Origin", "*")
=======
        print(to_be_returned)
>>>>>>> 84697ebe90568515aecda0eff3331a09f405023f
        return to_be_returned
api.add_resource(Upload, "/")

if(__name__ == "__main__"):
    UPLOAD_DIR = input("Enter a directory you want to use to store databases")
    app.run(debug=True)