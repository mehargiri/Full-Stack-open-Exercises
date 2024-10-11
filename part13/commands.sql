CREATE TABLE blogs (
	id SERIAL PRIMARY KEY,
	author text,
	uri text NOT NULL,
	title text NOT NULL, 
	likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, uri, title) values ('Dan Abramov', 'https://overreacted.io/on-let-vs-const/', 'On let vs const' );

INSERT INTO blogs (author, uri, title) values ('Laurenz Albe', 'https://www.cybertec-postgresql.com/en/gaps-in-sequences-postgresql/', 'Gaps in sequences in PostgreSQL' );

INSERT INTO blogs (author, uri, title) values ('Addy Osmani', 'https://addyosmani.com/largescalejavascript/', 'Patterns For Large-Scale JavaScript Application Architecture' );