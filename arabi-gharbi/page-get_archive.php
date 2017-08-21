<?php

	// GET ONLY THE APPROVED COMMENTS 
	$args = array(
	    'status' => 'approve'
	);
	 
	// THE COMMENT QUERY
	$comments_query = new WP_Comment_Query;
	$comments = $comments_query->query( $args );
	 
	// COMMENT LOOP
	$data = array();
	if ( $comments ) {
	    
	    foreach ( $comments as $comment ) { 

	    	$image_url = $comment->comment_content;
	    	// IF .PNG FILE
	    	if ( strpos( $image_url , '.png' ) !== false ) {
	    		// PUSH URL TO ARRAY
				$data[] = $image_url;
	    	}

	    }

	} 

	// var_dump( $data );

	echo json_encode($data);

?>