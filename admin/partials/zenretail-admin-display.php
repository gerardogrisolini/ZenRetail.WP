<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       http://www.zenretail.cloud:8181
 * @since      1.0.0
 *
 * @package    ZenRetail
 * @subpackage ZenRetail/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">

<h2 class="nav-tab-wrapper">ZenRetail</h2>

    <form method="post" name="cleanup_options" action="options.php">

    <?php
        //Grab all options
        $options = get_option($this->plugin_name);

        // Cleanup
        $url = $options['url'];
        $featured = $options['featured'];
        $news = $options['news'];
        $sale = $options['sale'];
        $brands = $options['brands'];
        ?>

    <?php
        settings_fields($this->plugin_name);
        do_settings_sections($this->plugin_name);
    ?>

    <!-- ZenRetail API -->
    <fieldset>
        <p><span class="trn">ZenRetail Url</span></p>
        <legend class="screen-reader-text"><span class="trn">Choose your zenretail url</span></legend>
        <input type="url" placeholder="http://www.zenretail.cloud:8181" class="regular-text" id="<?php echo $this->plugin_name; ?>-url" name="<?php echo $this->plugin_name; ?>[url]" value="<?php if(!empty($url)) echo $url; ?>"/>
        <a href="<?php if(!empty($url)) echo $url; ?>" id="open_webretail" target="blank" class="trn"> Open </a>
    </fieldset>

    <fieldset>

        <h3 class="trn">Include in homepage</h3>
 
        <!-- Featured -->
        <fieldset>
            <legend class="screen-reader-text"><span class="trn">Featured</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-featured">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-featured" name="<?php echo $this->plugin_name; ?>[featured]" value="1" <?php checked($featured, 1); ?> />
                <span class="trn">Featured</span>
            </label>
        </fieldset>

        <!-- News -->
        <fieldset>
            <legend class="screen-reader-text"><span class="trn">News</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-news">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-news" name="<?php echo $this->plugin_name; ?>[news]" value="1" <?php checked($news, 1); ?> />
                <span class="trn">News</span>
            </label>
        </fieldset>

        <!-- Sale -->
        <fieldset>
            <legend class="screen-reader-text"><span class="trn">Sale</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-sale">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-sale" name="<?php echo $this->plugin_name; ?>[sale]" value="1" <?php checked($sale, 1); ?> />
                <span class="trn">Sale</span>
            </label>
        </fieldset>

        <!-- Featured -->
        <fieldset>
            <legend class="screen-reader-text"><span class="trn">Brands</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-brands">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-brands" name="<?php echo $this->plugin_name; ?>[brands]" value="1" <?php checked($brands, 1); ?> />
                <span class="trn">Brands</span>
            </label>
        </fieldset>
    </fieldset>

    <p><button type="submit" name="submit" id="submit" class="button button-primary"><span class="trn">Save all changes</span></button></p>
</div>
