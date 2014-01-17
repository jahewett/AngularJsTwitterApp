﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace TwitterApp.Controllers
{
    public class TweetViewModel
    {
        public string ImageUrl { get; set; }
        public string ScreenName { get; set; }
        public string MediaUrl { get; set; }
        public string Tweet { get; set; }
        public string Id { get; set; }
    }
}
