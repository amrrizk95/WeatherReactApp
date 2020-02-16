{/* <div>
                            <form className="form-inline" onSubmit={this.handleSubmit}>
                                <input type="text" name="query" id="search-query" value={this.state.query} onChange={this.handelChange}  className="form-control" size="50" />
                                <button id="btn-search" className="btn btn-primary" onClick={this.handleSubmit}>Search</button>
                                <span id="search-result"></span>
                            </form>
                        </div>  */}


                    //     <Grid container>
                    //     <Grid item xs={12}>
              
                    //     </Grid>
                    // </Grid>



                    // handelChange(e){
                    //     this.setState({[e.target.name]: e.target.value});
                    // }
                    // handleSubmit(e) {
                    //     console.log(this.state)
                    //     this.setState({query:''})
                    //     e.preventDefault();
                    //   }

                    // function(data){
                    //     $.each(data.features,function(key,value){
                    //         if (value.properties.NAME.search(expression)!==-1) {
                    //              console.log(value.properties.NAME)
                                
                    //         }
                          
                    //     })
                     
                    //  }



                    for (var i = 0; i < data.length; i++) {
                        var feature = data[i];
                        if (feature['type'] == "Polyline") {
                            if (feature['properties']['road_length'] > 10) {
                                // draw Polyline
                            }
                        }
                    }


                    //search with bad implementation performance
                    //THIS IS  FUCNTION IS USED FOR SEARCH BUT ITS BAD INPERFORMANCE
                   function handleSearch (query)   {
                      let data=[]
                      this.state.names.map(function(algo){
                        query.split(" ").map(function(word){
                          if(algo.indexOf(word.toLowerCase()) !== -1){
                            data.push(algo)
                          }
                        })
                      })
                      this.setState({data})
                    };