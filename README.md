liveLogger
-------

a language agnostic application logger over websockets built with node.js, socket.io and angular



Install
-------

```bash
git clone https://github.com/bo01ean/liveLogger.git ## clone this repo
cd liveLogger ## change into project directory
bower install ## install front end requirements
npm install ## install backend requirements
npm start ## start server
```


To see log interface point your browser to:
http://localhost:8880/

You can send logs to the "log" channel using your favorite WebSocket client on port 8088.

Examples
--------

##PHP

Install ElephantIO into somewhere your autoloader can find

Send a message:

```php

    use ElephantIO\Client as Elephant;

    $liveLogger = new Elephant(
    "http://localhost:8088", 'socket.io', 1, false, true, false
            );
        // Where are we calling from
        $callers = debug_backtrace();
        // Which frame
        $caller = isset($callers[1]) ? $callers[1] : "root";
        // Host or CLI
        $host = (isset($_SERVER['HTTP_HOST'])) ? $_SERVER['HTTP_HOST'] : "CLI";
        
        $data = array(
          'host' => $host,
          'log' => $message,
          'caller' => $caller,
          'stamp' => date(DATE_RFC2822),
          'tag' => `hostname`,
        );
        
        $elephant->emit("log", $data);
      
```




