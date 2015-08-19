var jinst = require('../lib/jinst.js');
var nodeunit = require('nodeunit');
var derbyConn = new( require('../lib/jdbc.js') );

if (!jinst.isJvmCreated()) {
  jinst.setupClasspath(['./drivers/hsqldb.jar',
                        './drivers/derby.jar',
                        './drivers/derbyclient.jar',
                        './drivers/derbytools.jar']);
}

var config = {
  drivername: 'org.apache.derby.jdbc.ClientDriver',
  url: 'jdbc:derby://localhost:1527/testdb;create=true'
};

module.exports = {
  testinitderby: function(test) {
    derbyConn.initialize(config, function(err, drivername) {
      test.expect(2);
      test.equal(null, err);
      test.equal(drivername, 'org.apache.derby.jdbc.ClientDriver');
      test.done();
    });
  },
  testopen: function(test) {
    derbyConn.open(function(err, conn) {
      test.expect(2);
      test.equal(null, err);
      test.ok(conn);
      test.done();
    });
  },
  testcreatetable: function(test) {
    derbyConn.executeUpdate("CREATE TABLE blah (id int, name varchar(10), date DATE, time TIME, timestamp TIMESTAMP)", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  },
  testinsert: function(test) {
    derbyConn.executeUpdate("INSERT INTO blah VALUES (1, 'Jason', CURRENT_DATE, CURRENT_TIME, CURRENT_TIMESTAMP)", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testupdate: function(test) {
    derbyConn.executeUpdate("UPDATE blah SET id = 2 WHERE name = 'Jason'", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testselect: function(test) {
    derbyConn.executeQuery("SELECT * FROM blah", function(err, result) {
      test.expect(6);
      test.equal(null, err);
      test.ok(result && result.length == 1);
      test.equal(result[0].NAME, 'Jason');
      test.ok(result[0].DATE);
      test.ok(result[0].TIME);
      test.ok(result[0].TIMESTAMP);
      test.done();
    });
  },
  testeqdelete: function(test) {
    derbyConn.executeUpdate("DELETE FROM blah WHERE id = 2", function(err, result) {
      test.expect(2);
      test.equal(null, err);
      test.ok(result && result == 1);
      test.done();
    });
  },
  testdroptable: function(test) {
    derbyConn.executeUpdate("DROP TABLE blah", function(err, result) {
      test.expect(1);
      test.equal(null, err);
      test.done();
    });
  }
};
