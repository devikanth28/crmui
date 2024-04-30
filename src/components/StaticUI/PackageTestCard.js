import React from 'react'

const PackageTestCard = () => {
  return (
      <div class="card mb-0 p-12" style={{minHeight:"12.4725rem"}}>
              <div class=" mb-3">
                      <h6 class="text-dark text-truncate-2 mb-0" style={{minHeight:"2.39875rem"}}> MDx Diabetes Basic</h6><small class="text-muted">(7 Tests)</small>
              </div>
              <div class="d-flex align-items-center justify-content-between mb-4">
                  <div>
                      <p class="small text-secondary mb-0">MRP Price</p>
                      <h6 class="mb-0">
                          <span class="rupee small">&#x20B9;</span>710.00</h6>
                  </div>
                  <div>
                      <p class="small text-secondary mb-0">MA Price</p>
                      <h6 class="mb-0"><span class="rupee small">&#x20B9;</span>510.00</h6>
                  </div>
              </div>
              <div class="text-end">
                  <button class="btn btn-sm btn-success font14 nonmemberprice" type="button" role="button">Book Test</button></div></div>
  )
}

export default PackageTestCard
