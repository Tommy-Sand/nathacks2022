import flask
from flask_restful import reqparse, Api, Resource, inputs
import werkzeug
from process_eeg import process_eeg
from pathlib import Path

UPLOAD_DIR = input("Enter a directory you want to use to store databases")

app = flask.Flask(__name__)
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
        return to_be_returned
api.add_resource(Upload, "/")

if(__name__ == "__main__"):
    app.run(debug=True)