<?php

/**
 * TurboValidator 1.0 by Tierlabs
 * Created by: Brian Seymour
 * 
 * License: GNU General Public License Version 2.0
 * 
 * Mandatory Dependencies:
 * - jQuery
 * 
 * Recommended Dependencies:
 * - Bootstrap
 * 
 * The purpose of this validator is to allow high speed server side
 * validation with a low maintenance foot print and an intuitive interface.
 * 
 * TurboValidator design goals:
 * - AJAX Enabled
 * - Clean Validation Errors
 * - Minimum Code Absolutely Necessary/Required (MCAN/R)
 */

class RulesBase {

    public static $rules = array(
        /**
         * Validation Options
         * required     => check for empty values
         * letters_only => check for only letters
         * numbers_only => check for only numbers
         */
        
        // demo samples
        'name'       => array('required', 'letters_only'), // sample field, do not use
        'age'        => array('required', 'numbers_only'), // sample field, do not use
        'type'       => array('required'),                 // sample field, do not use
        'comments'   => array('required'),                 // sample field, do not use
        'must_check' => array('checked'),                  // sample field, do not use
        // demo samples
    );
    
}