from flask import Flask, jsonify, request
from flask_cors import CORS
import pyodbc
from config import db_settings

app = Flask(__name__)
CORS(app)

conn_str = (
    f"Driver={{{db_settings['driver']}}};"
    f"Server={db_settings['server']};"
    f"Database={db_settings['database']};"
    f"Trusted_Connection={db_settings['trusted_connection']};"
)