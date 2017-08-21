<html lang='en'>
    <head>
        <title>Gajus Kuizinas</title>
    </head>
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        #video_sources {
            border: 0px solid orange;
            /*max-width: 640px;*/
            width: calc( 100vw - 40px);
            min-height: calc( 100vh - 40px );
            margin: 20px;
            /*overflow: hidden;*/
            position: relative;
        }

        .video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 90vh;
        }

        iframe {
            border: 0px;
            position: absolute;
            top: -20px;
            margin-top: -20px;
            left: -20px;
            margin-left: -20px;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
        }

    </style>

    <body>

    <div id='app'>

        <?php /*

        <h1>Gajus Kuizinas</h1>
        <p>Software architect. Passionate about JavaScript and Hack. Active open-source contributor. Rx, React, GraphQL, Redux.</p>
        <br />
        <p>I am currently creating <a href='https://go2cinema.com/'>GO2CINEMA</a> – a cinema ticket marketplace.</p>
        <br />
        <p>If you are looking for the articles previously published on this domain, refer to <a href='https://github.com/gajus/gajus.com-blog'>https://github.com/gajus/gajus.com-blog</a>.</p>
        <br />
        <h2>Contacts</h2>
        <ul>
            <li>
                <a href='mailto:gajus@gajus.com'>gajus@gajus.com</a>
            </li>
            <li>
                <a href='https://twitter.com/kuizinas'>https://twitter.com/kuizinas</a>
            </li>
            <li>
                <a href='https://www.linkedin.com/in/gajus/'>https://www.linkedin.com/in/gajus/</a>
            </li>
            <li>
                <a href='https://github.com/gajus'>https://github.com/gajus</a>
            </li>
        </ul>

        */ ?>

        <div id="video_sources">
            <!-- INITIAL VIDEO -->
            <div class="video">
                <iframe id="video-1" src="https://player.vimeo.com/video/228551979" width="640" height="360"></iframe>
            </div>
        
        </div>

    </div>

    </body>

</html>
