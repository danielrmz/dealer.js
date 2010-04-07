var dealer = require('../lib'),
    assert = require('assert'),
       sys = require('sys')

var d = dealer.create()

assert.deepEqual({}, d.ids)
assert.deepEqual({}, d.channels)

// connect first client
var client = d.connect('a', '/foo?id=abc')
assert.equal('abc', client.id)
assert.equal('foo', client.channel)
assert.equal('a',   client.socket)
assert.deepEqual([client.id], Object.keys(d.channels.foo.subscribers))
assert.deepEqual(client,      d.ids.abc)

// connect second client
var client2 = d.connect('a', '/foo?id=def')
assert.equal('def', client2.id)
assert.equal('foo', client2.channel)
assert.equal('a',   client2.socket)
assert.deepEqual([client.id, client2.id], Object.keys(d.channels.foo.subscribers))
assert.deepEqual(client2, d.ids.def)

// same id as client, but different channel
var client3 = d.connect('b', '/bar?id=abc')
assert.equal('abc', client3.id)
assert.equal('bar', client3.channel)
assert.equal('b',   client3.socket)
assert.deepEqual([client3.id], Object.keys(d.channels.bar.subscribers))
assert.deepEqual(client3, d.ids.abc)

// check that client3 is removed from foo channel
assert.deepEqual([client2.id], Object.keys(d.channels.foo.subscribers))

// disconnect client2
d.disconnect(client2)
assert.equal(null, d.ids[client2.id])
assert.deepEqual([], Object.keys(d.channels.foo.subscribers))

sys.puts('pass!')