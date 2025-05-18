from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///animeshelf.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Media(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)

@app.route('/')
def index():
    media_list = Media.query.all()
    return render_template('index.html', media_list=media_list)

@app.route('/add', methods=['POST'])
def add():
    title = request.form['title']
    if title:
        new_media = Media(title=title)
        db.session.add(new_media)
        db.session.commit()
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)

